import pandas as pd
from random import randint
from bs4 import BeautifulSoup
import requests
import sys
import json
import os
dir_path = os.path.dirname(os.path.realpath(__file__))

twitter_handle_path = '../data/TwitterHandles.csv'
twitter_handle_data = pd.DataFrame.from_csv(twitter_handle_path,index_col=None)

# Now we have the data in the dataframe, so lets grab a random twitter handle and party name
rand_int= randint(0, len(twitter_handle_data))
representative = twitter_handle_data.iloc[rand_int]

party = representative['Party']
twitter_handle = representative['TwitterHandle']

# Cool, now we need to find their latest tweet by using beautiful soup.
twitter_url = 'https://twitter.com/' + twitter_handle
r  = requests.get(twitter_url)
data = r.text
soup = BeautifulSoup(data,'lxml')
tweet = soup.findAll("p", { "class" : "tweet-text" })[0].getText()

data_dict = {}
data_dict['party'] = party
data_dict['twitter_handle'] = twitter_handle
data_dict['tweet'] = tweet

print json.dumps(data_dict)
sys.stdout.flush()
