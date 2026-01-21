# Developmental change in structure learning reflects a shift from recency-based to relational prediction 
Task code, anonymized data, and analysis code for: Nussenbaum, K. et al. *Developmental change in structure learning reflects a shift from recency-based to relational prediction* 

## Task
The task was written using jsPsych and hosted on pavlovia.org. In addition to completing the graph-learning experiment described in the manuscript, participants completed a short matrix reasoning task.

## Data
Data for each subject is stored in `data/sub_data`. Each participant has two data files, one for the learning and parsing task, and one with their responses from the graph reconstruction task.

## Analyses
Behavioral data was processed and analyzed in R with the `graph_learning_manuscript_R1.Rmd ` script.

Computational modeling was conducted in julia with the [em package](https://github.com/ndawlab/em). All modeling code is located in `modeling.`