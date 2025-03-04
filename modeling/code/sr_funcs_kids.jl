function em_opt_extended(trials,subs,X,betas,sigma,lik_fn,varnames;
    emtol=1e-3, maxiter=100, full=true, extended=true, quiet=false, threads=true, nstarts=1, noprior=false, startx=nothing)
    if noprior
        if nstarts > 1
            return emnoprior(trials,subs,X,betas,sigma,lik_fn;nstarts=nstarts)
        else
            return emnoprior(trials,subs,X,betas,sigma,lik_fn;nstarts=1)
        end
    else
        _startx = []
        if nstarts > 1
            _startx = eminits(trials,subs,X,betas,sigma,lik_fn;nstarts=nstarts,threads=threads)
        elseif !isnothing(startx)
            _startx = startx
        end
        (betas,sigma,x,l,h,opt_rec) = em(trials,subs,X,betas,sigma,lik_fn; emtol=emtol, full=full, maxiter=maxiter, quiet=quiet, threads=threads, startx=_startx);
        if extended
            try
                @info "Running emerrors"
                (standarderrors,pvalues,covmtx) = emerrors(trials,subs,x,X,h,betas,sigma,lik_fn)
                return EMResultsExtended(varnames,betas,sigma,x,l,h,opt_rec,standarderrors,pvalues,covmtx)
            catch err
                if isa(err, SingularException) || isa(err, DomainError) || isa(err, LAPACKException)
                @warn err
                    @warn "emerrors failed to run. Re-check fitting. Returning EMResults"
                    return EMResults(varnames,betas,sigma,x,l,h,opt_rec)
                else
                    rethrow()
                end
            end
        else
            return EMResults(varnames,betas,sigma,x,l,h,opt_rec)
        end
    end
end

modular_T = [
    0  1  1  1  0  0  0  0  0  0  0  0  0  0  1
    1  0  1  1  1  0  0  0  0  0  0  0  0  0  0
    1  1  0  1  1  0  0  0  0  0  0  0  0  0  0
    1  1  1  0  1  0  0  0  0  0  0  0  0  0  0
    0  1  1  1  0  1  0  0  0  0  0  0  0  0  0
    0  0  0  0  1  0  1  1  1  0  0  0  0  0  0
    0  0  0  0  0  1  0  1  1  1  0  0  0  0  0
    0  0  0  0  0  1  1  0  1  1  0  0  0  0  0
    0  0  0  0  0  1  1  1  0  1  0  0  0  0  0
    0  0  0  0  0  0  1  1  1  0  1  0  0  0  0
    0  0  0  0  0  0  0  0  0  1  0  1  1  1  0
    0  0  0  0  0  0  0  0  0  0  1  0  1  1  1
    0  0  0  0  0  0  0  0  0  0  1  1  0  1  1
    0  0  0  0  0  0  0  0  0  0  1  1  1  0  1
    1  0  0  0  0  0  0  0  0  0  0  1  1  1  0
    ] .* 0.25

""" 
get_subject_T_mean

Total matrix of counts, normalized for each row to sum to 1
"""
function get_subject_T_mean(data) 
    T = zeros(15, 15)
    for i in 1:15
        for j in 1:15
            T[i,j] = sum((data.node[1:end-1] .== i) .& (data.node[2:end] .== j))
        end
        T[i, i] = 0
        T[i, :] ./= sum(T[i, :])
    end
    return T
end

# """
# get_subject_T_cumulative

# Total matrix of counts, up through max_t, normalized for each row to sum to 1
# """
# function get_subject_T_cumulative(data, max_t) 
#     T = zeros(15, 15)
#     for i in 1:15
#         for j in 1:15
#             T[i,j] = 1 + sum((data.node[1:max_t-1] .== i) .& (data.node[2:max_t] .== j))
#         end
#         T[i, i] = 0
#         T[i, :] ./= sum(T[i, :])
#     end
#     return T
# end

""" 
get_subject_A_timeseries

Step-by-step matrix of counts

returns:
A: (ntrials x 15 x 15)
"""
function get_subject_A_timeseries(data) 
    # Initialize with 1 to keep things more stable
    A = ones(length(data.node), 15, 15)
    for t in 2:length(data.node)
        @views A[t, :, :] .= A[t-1, :, :]
        A[t, data.node[t-1], data.node[t]] += 1
    end
    return A
end

""" 
get_subject_T_timseries

Step-by-step normalized transition matrix based on counts

returns
T: (ntrials x 15 x 15)
"""
function get_subject_T_timeseries(data)
    T = get_subject_A_timeseries(data)
    for t in 1:length(data.node)
        for i in 1:15
            @views T[t, i, :] ./= sum(T[t, i, :])
        end
    end
    return T
end

""" 
get_subject_M_timseries

Step-by-step SR M matrix based on inverting normalized counts

returns:
M: (ntrials x 15 x 15)
"""
function get_subject_M_timeseries(data, γ)
    T = get_subject_T_timeseries(data)
    M = zeros(size(T))
    ident = I(15)
    for t in 1:length(data.node)
        @views M[t, :, :] .= inv(ident .- γ .* T[t, :, :])
    end
    return M
end

function lik_baseline_keys(data, rt_μ::U, rt_σ, rt_shift, β_trial, β_targets, β_keys, β_recency_exp, recency_exp_decay, β_recency_ntrials, β_recency_lag10, β_zero_order, α_zero_order, warmup, record) where U
    recency_exp = zeros(U, 15)
    recency_ntrials = zeros(U, 15)
    recency_lag10 = zeros(U, 15)
    zero_order = zeros(U, 15) .+ 1.0/15

    lik = 0.
    lik_trial = 0.
    
    trials = data.trial
    node = data.node
    targetid = data.targetid
    rt = data.rt
    isValid = data.isValid
    keyid = data.keyid

    ntrials = length(trials)

    # We're implementing the shift as the fraction of the minimum RT for this subject
    # 0 is no shift, 1 is its maximum value
    m_rt_shift = rt_shift * minimum(rt[isValid])

    if record
        rt_pred_rec = zeros(ntrials)
        zero_order_rec = zeros(ntrials, 15)
        lik_rec = zeros(ntrials)
    end

    for t in eachindex(trials)
        if record
            @views zero_order_rec[t, :] .= zero_order
        end

        @inbounds if isValid[t]
            # Shifted Log Normal
            @inbounds rt_pred = rt_μ + β_trial * trials[t] + β_targets[targetid[t]] + β_keys[keyid[t]]
            @inbounds rt_pred += β_recency_exp * recency_exp[node[t]] + β_recency_ntrials * recency_ntrials[node[t]] + β_recency_lag10 * recency_lag10[node[t]]
            @inbounds rt_pred += β_zero_order * zero_order[node[t]]
            if record; rt_pred_rec[t] = rt_pred; end
            @inbounds lik_trial = -log(sqrt(2*pi)*rt_σ*(rt[t] - m_rt_shift)) - 1/(2 * rt_σ^2) * (log(rt[t] - m_rt_shift) - rt_pred)^2 
            if t > warmup
                lik += lik_trial
            end
            if record
                lik_rec[t] = lik_trial
            end
        end

        recency_exp .*= recency_exp_decay
        if t > 1
            @inbounds recency_exp[node[t-1]] += 1  # recency_exp only makes sense for two-back, etc
        end

        @inbounds recency_ntrials[node[t]] = 0
        recency_ntrials .+= 1

        @inbounds recency_lag10[node[t]] += 1
        if t > 10
            @inbounds recency_lag10[node[t-10]] -= 1
        end
        zero_order .*= (1 - α_zero_order)
        @inbounds zero_order[node[t]] += α_zero_order
        
    end
    if record
        return (-lik, lik_rec, rt_pred_rec, zero_order_rec)
    else
        return -lik
    end
end

function lik_sr_td_future_dutch_keys(data, rt_μ::U, rt_σ, rt_shift, β_trial, β_targets, β_keys, β_anticipation, β_recency_exp, recency_exp_decay, β_recency_ntrials, β_recency_lag10, β_zero_order, α_zero_order, αM, γ, γ_init, λ, normalize_prediction, naive, warmup, record) where U
    T = zeros(U, 15, 15)
    if naive
        T .+= 1.0/15  # Assume equal probabilities for all transitions
    else
        T .= get_subject_T_mean(data)
    end
    ident = Matrix{U}(LinearAlgebra.I, 15, 15)
    M = inv(ident .- γ_init * T) * T

    δM = zeros(U, 15)
    trace = zeros(U, 15)
    recency_exp = zeros(U, 15)
    recency_ntrials = zeros(U, 15)
    recency_lag10 = zeros(U, 15)
    zero_order = zeros(U, 15) .+ 1.0/15
    prediction = U(0.0)

    lik = 0.
    lik_trial = 0.
    
    trials = data.trial
    node = data.node
    targetid = data.targetid
    rt = data.rt
    isValid = data.isValid
    keyid = data.keyid

    ntrials = length(trials)

    # We're implementing the shift as the fraction of the minimum RT for this subject
    # 0 is no shift, 1 is its maximum value
    m_rt_shift = rt_shift * minimum(rt[isValid])

    if record
        rt_pred_rec = zeros(ntrials)
        M_rec = zeros(ntrials, 15, 15)
        zero_order_rec = zeros(ntrials, 15)
        lik_rec = zeros(ntrials)
    end

    for t in eachindex(trials)
        if record
            @views M_rec[t,:,:] .= M
            @views zero_order_rec[t, :] .= zero_order
        end
        if t > 1 
            @inbounds prediction = M[node[t-1], node[t]]
            if normalize_prediction
                @inbounds prediction /= sum(view(M, node[t-1], :))
            end
        else
            prediction = 0.0
        end

        @inbounds if isValid[t]
            # Shifted Log Normal
            @inbounds rt_pred = rt_μ + β_trial * trials[t] + β_targets[targetid[t]] + β_keys[keyid[t]] + β_anticipation * prediction
            @inbounds rt_pred += β_recency_exp * recency_exp[node[t]] + β_recency_ntrials * recency_ntrials[node[t]] + β_recency_lag10 * recency_lag10[node[t]]
            @inbounds rt_pred += β_zero_order * zero_order[node[t]]
            if record; rt_pred_rec[t] = rt_pred; end
            @inbounds lik_trial = -log(sqrt(2*pi)*rt_σ*(rt[t] - m_rt_shift)) - 1/(2 * rt_σ^2) * (log(rt[t] - m_rt_shift) - rt_pred)^2 
            if t > warmup
                lik += lik_trial
            end
            if record
                lik_rec[t] = lik_trial
            end
        end

        if t > 1
            # Update trace
            @inbounds trace[node[t-1]] *= (1 - αM)
            @inbounds trace[node[t-1]] += 1.0

            # Update M

            # δM is our state misprediction: (Iₛ + γ M_s') vs. (M_s)
            # Move each state's prediction in the direction of δM based on the trace
            @inbounds @views δM .= ident[node[t], :] .+ γ .* M[node[t], :] .- M[node[t-1], :]
            for sx in 1:15
                @inbounds @views M[sx, :] .+= (αM .* trace[sx]) .* δM
            end
            @views trace .*= λ * γ
        end

        recency_exp .*= recency_exp_decay
        if t > 1
            @inbounds recency_exp[node[t-1]] += 1  # recency_exp only makes sense for two-back, etc
        end

        @inbounds recency_ntrials[node[t]] = 0
        recency_ntrials .+= 1

        @inbounds recency_lag10[node[t]] += 1
        if t > 10
            @inbounds recency_lag10[node[t-10]] -= 1
        end
        zero_order .*= (1 - α_zero_order)
        @inbounds zero_order[node[t]] += α_zero_order
        
    end
    if record
        return (-lik, lik_rec, rt_pred_rec, M_rec, zero_order_rec)
    else
        return -lik
    end
end

function lik_Tpows_keys(data, rt_μ::U, rt_σ, rt_shift, β_trial, β_targets, β_keys, β_T1, β_T2, β_T3, β_recency_exp, recency_exp_decay, β_recency_ntrials, β_recency_lag10, β_zero_order, α_zero_order, αT, naive, warmup, record) where U
    T = zeros(U, 15, 15)
    if naive
        T .+= 1.0/15  # Assume equal probabilities for all transitions
    else
        T .= get_subject_T_mean(data)
    end
    recency_exp = zeros(U, 15)
    recency_ntrials = zeros(U, 15)
    recency_lag10 = zeros(U, 15)
    zero_order = zeros(U, 15)

    lik = 0.
    lik_trial = 0.
    x1 = 0.
    x2 = 0.
    x3 = 0.
    
    trials = data.trial
    node = data.node
    targetid = data.targetid
    rt = data.rt
    isValid = data.isValid
    keyid = data.keyid

    ntrials = length(trials)

    # We're implementing the shift as the fraction of the minimum RT for this subject
    # 0 is no shift, 1 is its maximum value
    m_rt_shift = rt_shift * minimum(rt[isValid])

    if record
        rt_pred_rec = zeros(ntrials)
        T_rec = zeros(ntrials, 15, 15)
        lik_rec = zeros(ntrials)
        zero_order_rec = zeros(ntrials, 15)
    end

    for t in eachindex(trials)
        prediction = 0.0
        if t > 1 
            x1 = T[node[t-1], node[t]]
            x2 = 0
            x3 = 0
            # Manually calculate entries of T^n, much faster for optimization
            for i in 1:15
                @inbounds x2 += T[node[t-1], i] * T[i, node[t]]
            end
            for i in 1:15
                for j in 1:15
                    @inbounds x3 += T[node[t-1], i] * T[i, j] * T[j, node[t]]
                end
            end
            prediction += β_T1 * x1
            prediction += β_T2 * x2
            prediction += β_T3 * x3
        end

        if isValid[t]
            # Shifted Log Normal
            @inbounds rt_pred = rt_μ + β_trial * trials[t] + β_targets[targetid[t]] + β_keys[keyid[t]] + prediction
            @inbounds rt_pred += β_recency_exp * recency_exp[node[t]] + β_recency_ntrials * recency_ntrials[node[t]] + β_recency_lag10 * recency_lag10[node[t]]
            @inbounds rt_pred += β_zero_order * zero_order[node[t]]
            if record; rt_pred_rec[t] = rt_pred; end
            @inbounds lik_trial = -log(sqrt(2*pi)*rt_σ*(rt[t] - m_rt_shift)) - 1/(2 * rt_σ^2) * (log(rt[t] - m_rt_shift) - rt_pred)^2 
            if t > warmup
                lik += lik_trial
            end
            if record
                @inbounds lik_rec[t] = lik_trial
            end
        end

        if (αT > 0) && (t > 1)
            # Update T
            T[node[t-1], :] .*= (1 - αT)
            T[node[t-1], node[t]] += αT
            # Smoother approach
            # T[node[t-1], node[t]] += αT
            # T[node[t-1], :] ./= sum(view(T, node[t-1], :))
        end

        recency_exp .*= recency_exp_decay
        if t > 1
            @inbounds recency_exp[node[t-1]] += 1  # recency_exp only makes sense for two-back, etc
        end

        @inbounds recency_ntrials[node[t]] = 0
        recency_ntrials .+= 1

        @inbounds recency_lag10[node[t]] += 1
        if t > 10
            @inbounds recency_lag10[node[t-10]] -= 1
        end

        if record; zero_order_rec[t, :] .= zero_order; end
        zero_order .*= (1 - α_zero_order)
        @inbounds zero_order[node[t]] += α_zero_order
        if record; T_rec[t, :, :] .= T; end
    end
    if record
        return (-lik, lik_rec, rt_pred_rec, T_rec, zero_order_rec)
    else
        return -lik
    end
end

function run_baseline_rt_shift_trial_alltargets_keys(trials; warmup=-1,
    add_recency_exp=false, add_recency_ntrials=false, add_recency_lag10=false, add_zero_order=false,
    covariates=nothing, emtol=1e-3, maxiter=100, full=false, extended=true, quiet=false, threads=true, nstarts=1, existing=nothing)
    function lik_fn(params, data)
        i = 1
        rt_μ = params[i]; i += 1
        rt_σ = exp(params[i]); i += 1
        rt_shift = unitnorm(params[i]); i += 1
        β_trial = params[i]; i += 1
        if add_recency_exp
            β_recency_exp = params[i]; i += 1
            recency_exp_decay = params[i]; i += 1
        else
            β_recency_exp = 0.0
            recency_exp_decay = 0.0
        end
        if add_recency_ntrials
            β_recency_ntrials = params[i]; i += 1
        else
            β_recency_ntrials = 0.0
        end
        if add_recency_lag10
            β_recency_lag10 = params[i]; i += 1
        else
            β_recency_lag10 = 0.0
        end
        if add_zero_order
            β_zero_order = params[i]; i += 1
            α_zero_order = unitnorm(params[i]); i += 1
        else
            β_zero_order = 0.0
            α_zero_order = 0.0
        end
        β_targets = vcat([0], params[i:i+13]); i += 14
        β_keys = vcat([0], params[i]); i += 1
        return lik_baseline_keys(data, rt_μ, rt_σ, rt_shift, β_trial, β_targets, β_keys, β_recency_exp, recency_exp_decay, β_recency_ntrials, β_recency_lag10, β_zero_order, α_zero_order, warmup, false)
    end
    subs = unique(trials.sub)
    X = [ones(length(subs));];
    varnames = ["rt_μ", "rt_σ", "rt_shift", "β_trial"]
    if add_recency_exp
        push!(varnames, "β_recency_exp")
        push!(varnames, "recency_exp_decay")
    end
    if add_recency_ntrials
        push!(varnames, "β_recency_ntrials")
    end
    if add_recency_lag10
        push!(varnames, "β_recency_lag10")
    end
    if add_zero_order
        push!(varnames, "β_zero_order")
        push!(varnames, "α_zero_order")
    end
    for i in 2:15
        push!(varnames, "β_targets_$i")
    end
    push!(varnames, "β_key_2")
    betas = zeros(length(varnames))
    if !isnothing(covariates)
        betas = hcat(betas, zeros(length(betas)))
        println(size(X))
        println(size(covariates))
        X = hcat(X, covariates)
    end
    betasT = Array(betas')
    sigma = ones(length(varnames))
    startx = nothing
    if !isnothing(existing)
        println(size(sigma))
        println(size(existing.sigma))
        sigma .= diag(existing.sigma)
        betasT .= existing.betas
        startx = copy(existing.x)
    end
    em_opt_extended(trials,subs,X,betasT,sigma,lik_fn,varnames; emtol, maxiter, full, extended, quiet, threads, nstarts, startx)
end

function run_sr_td_future_dutch_rt_shift_trial_alltargets_keys(trials; warmup=-1, normalize_prediction=false, naive=false,
    add_recency_exp=false, add_recency_ntrials=false, add_recency_lag10=false, add_zero_order=false, add_ginit=false, add_αM=false,
    covariates=nothing, emtol=1e-3, maxiter=100, full=false, extended=true, quiet=false, threads=true, nstarts=1, existing=nothing)
    function lik_fn(params, data)
        i = 1
        rt_μ = params[i]; i += 1
        rt_σ = exp(params[i]); i += 1
        rt_shift = unitnorm(params[i]); i += 1
        β_trial = params[i]; i += 1
        β_anticipation = params[i]; i += 1
        if add_recency_exp
            β_recency_exp = params[i]; i += 1
            recency_exp_decay = params[i]; i += 1
        else
            β_recency_exp = 0.0
            recency_exp_decay = 0.0
        end
        if add_recency_ntrials
            β_recency_ntrials = params[i]; i += 1
        else
            β_recency_ntrials = 0.0
        end
        if add_recency_lag10
            β_recency_lag10 = params[i]; i += 1
        else
            β_recency_lag10 = 0.0
        end
        if add_zero_order
            β_zero_order = params[i]; i += 1
            α_zero_order = unitnorm(params[i]); i += 1
        else
            β_zero_order = 0.0
            α_zero_order = 0.0
        end
        if add_αM
            αM = unitnorm(params[i]); i += 1
        else
            αM = 0.0
        end
        γ = (1 - 1e-5) * unitnorm(params[i]); i += 1 # Should be enough to prevent inversion errors
        if add_ginit
            γ_init = (1 - 1e-5) * unitnorm(params[i]); i += 1
        else
            γ_init = γ
        end
        λ = unitnorm(params[i]); i += 1
        β_targets = vcat([0], params[i:i+13]); i += 14
        β_keys = vcat([0], params[i]); i += 1
        return lik_sr_td_future_dutch_kids(data, rt_μ, rt_σ, rt_shift, β_trial, β_targets, β_keys, β_anticipation, β_recency_exp, recency_exp_decay, β_recency_ntrials, β_recency_lag10, β_zero_order, α_zero_order, αM, γ, γ_init, λ, normalize_prediction, naive, warmup, false)
    end
    subs = unique(trials.sub)
    X = [ones(length(subs));];
    varnames = ["rt_μ", "rt_σ", "rt_shift", "β_trial", "β_anticipation"]
    if add_recency_exp
        push!(varnames, "β_recency_exp")
        push!(varnames, "recency_exp_decay")
    end
    if add_recency_ntrials
        push!(varnames, "β_recency_ntrials")
    end
    if add_recency_lag10
        push!(varnames, "β_recency_lag10")
    end
    if add_zero_order
        push!(varnames, "β_zero_order")
        push!(varnames, "α_zero_order")
    end
    if add_αM
        push!(varnames, "αM")
    end
    push!(varnames, "γ")
    if add_ginit
        push!(varnames, "γ_init")
    end
    push!(varnames, "λ")
    for i in 2:15
        push!(varnames, "β_targets_$i")
    end
    push!(varnames, "β_key_2")
    betas = zeros(length(varnames))
    if !isnothing(covariates)
        betas = hcat(betas, zeros(length(betas)))
        println(size(X))
        println(size(covariates))
        X = hcat(X, covariates)
    end
    betasT = Array(betas')
    sigma = ones(length(varnames))
    startx = nothing
    if !isnothing(existing)
        println(size(sigma))
        println(size(existing.sigma))
        sigma .= diag(existing.sigma)
        betasT .= existing.betas
        startx = copy(existing.x)
    end
    em_opt_extended(trials,subs,X,betasT,sigma,lik_fn,varnames; emtol, maxiter, full, extended, quiet, threads, nstarts, startx)
end

function run_Tpows_rt_shift_trial_alltargets_keys(trials; warmup=-1, npows=1, naive=false,
    add_recency_exp=false, add_recency_ntrials=false, add_recency_lag10=false, add_zero_order=false, add_αT=false,
    covariates=nothing, emtol=1e-3, maxiter=100, full=false, extended=true, quiet=false, threads=true, nstarts=1)
    function lik_fn(params, data)
        i = 1
        rt_μ = params[i]; i += 1
        rt_σ = exp(params[i]); i += 1
        rt_shift = unitnorm(params[i]); i += 1
        β_trial = params[i]; i += 1
        β_T1 = 0.0
        β_T2 = 0.0
        β_T3 = 0.0
        if npows >= 1
            β_T1 = params[i]; i += 1
        end
        if npows >= 2
            β_T2 = params[i]; i += 1
        end
        if npows >= 3
            β_T3 = params[i]; i += 1
        end
        if add_recency_exp
            β_recency_exp = params[i]; i += 1
            recency_exp_decay = params[i]; i += 1
        else
            β_recency_exp = 0.0
            recency_exp_decay = 0.0
        end
            β_recency_ntrials = 0.0
        if add_recency_ntrials
            β_recency_ntrials = params[i]; i += 1
        end
        if add_recency_lag10
            β_recency_lag10 = params[i]; i += 1
        else
            β_recency_lag10 = 0.0
        end
        if add_zero_order
            β_zero_order = params[i]; i += 1
            α_zero_order = unitnorm(params[i]); i += 1
        else
            β_zero_order = 0.0
            α_zero_order = 0.0
        end
        if add_αT
            αT = unitnorm(params[i]); i += 1
        else
            αT = 0.0
        end
        β_targets = vcat([0], params[i:i+13]); i += 14
        β_keys = vcat([0], params[i]); i += 1
        return lik_Tpows_keys(data, rt_μ, rt_σ, rt_shift, β_trial, β_targets, β_keys, β_T1, β_T2, β_T3, β_recency_exp, recency_exp_decay, β_recency_ntrials, β_recency_lag10, β_zero_order, α_zero_order, αT, naive, warmup, false)
    end
    subs = unique(trials.sub)
    X = [ones(length(subs));];
    varnames = ["rt_μ", "rt_σ", "rt_shift", "β_trial"]
    if npows >= 1
        push!(varnames, "β_T1")
    end
    if npows >= 2
        push!(varnames, "β_T2")
    end
    if npows >= 3
        push!(varnames, "β_T3")
    end
    if add_recency_exp
        push!(varnames, "β_recency_exp")
        push!(varnames, "recency_exp_decay")
    end
    if add_recency_ntrials
        push!(varnames, "β_recency_ntrials")
    end
    if add_recency_lag10
        push!(varnames, "β_recency_lag10")
    end
    if add_zero_order
        push!(varnames, "β_zero_order")
        push!(varnames, "α_zero_order")
    end
    if add_αT
        push!(varnames, "αT")
    end
    for i in 2:15
        push!(varnames, "β_targets_$i")
    end
    push!(varnames, "β_key_2")
    betas = zeros(length(varnames))
    if !isnothing(covariates)
        betas = hcat(betas, zeros(length(betas)))
        X = hcat(X, covariates)
    end
    betasT = Array(betas')
    sigma = ones(length(varnames))
    em_opt_extended(trials,subs,X,betasT,sigma,lik_fn,varnames; emtol, maxiter, full, extended, quiet, threads, nstarts)
end