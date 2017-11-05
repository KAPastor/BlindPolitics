import pandas as pd
from random import randint
import requests
import sys
import sqlite3
import re
import json

# conn_t_stats = sqlite3.connect('C:\Projects\BlindPolitics/data/twitter_stats.db')
# conn_raw_tweet = sqlite3.connect('C:\Projects\BlindPolitics/data/user_guess.db')

conn_t_stats = sqlite3.connect('../data/twitter_stats.db')
conn_raw_tweet = sqlite3.connect('../data/user_guess.db')

data_dict = {}

c_raw_tweet = conn_raw_tweet.cursor()
c_t_stats = conn_t_stats.cursor()

# Get the totals...
q_get_total =  "SELECT COUNT(*) FROM guess"
c_raw_tweet.execute(q_get_total)
total_num = c_raw_tweet.fetchone()
# Num(correct)
q_correct =  "SELECT count(*) FROM guess WHERE Party = Guess"
c_raw_tweet.execute(q_correct)
num_correct= c_raw_tweet.fetchone()


# Num(DEM)
q_num_dem =  "SELECT count(*) FROM guess WHERE Party = 'Democrat'"
c_raw_tweet.execute(q_num_dem)
total_num_dem= c_raw_tweet.fetchone()
# Num(REP)
q_num_rep =  "SELECT count(*) FROM guess WHERE Party = 'Republican'"
c_raw_tweet.execute(q_num_rep)
total_num_rep= c_raw_tweet.fetchone()

# Num(correct|Dem)
q_correct_given_dem =  "SELECT count(*) FROM guess WHERE Party = Guess AND party='Democrat'"
c_raw_tweet.execute(q_correct_given_dem)
num_correct_given_dem= c_raw_tweet.fetchone()

# Num(correct|Rep)
q_correct_given_rep =  "SELECT count(*) FROM guess WHERE Party = Guess AND party='Republican'"
c_raw_tweet.execute(q_correct_given_rep)
num_correct_given_rep= c_raw_tweet.fetchone()

# Now we can calculate the probabilities:

data_dict['total_num'] = total_num[0]
data_dict['total_num_dem'] = total_num_dem[0]
data_dict['total_num_rep'] = total_num_rep[0]


data_dict['p_correct'] = float(num_correct[0])/float(total_num[0])
data_dict['p_wrong'] = 1.0-data_dict['p_correct']

data_dict['p_correct_g_dem'] = float(num_correct_given_dem[0])/float(total_num_dem[0])
data_dict['p_wrong_g_dem'] = 1.0-data_dict['p_correct_g_dem']

data_dict['p_correct_g_rep'] = float(num_correct_given_rep[0])/float(total_num_rep[0])
data_dict['p_wrong_g_rep'] = 1.0-data_dict['p_correct_g_rep']

# I also want the top 20 words from reps and dems
common_words = "'the','be','to','of','and','a','in','that','is','have','I','it','for','not','on','with','he','as','you','do','at'"


rep_words =  "SELECT DISTINCT word,total_guess_num FROM tweet_data WHERE party='Republican' AND word NOT IN ("+common_words+") ORDER BY total_guess_num desc LIMIT 50"
dem_words =  "SELECT DISTINCT word,total_guess_num FROM tweet_data WHERE party='Democrat' AND word NOT IN ("+common_words+")  ORDER BY total_guess_num desc LIMIT 50"

c_t_stats.execute(rep_words)
rep_words= c_t_stats.fetchall()
data_dict['rep_words'] = rep_words

c_t_stats.execute(dem_words)
dem_words= c_t_stats.fetchall()
data_dict['dem_words'] = dem_words


print json.dumps(data_dict)
sys.stdout.flush()
