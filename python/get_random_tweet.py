import pandas as pd
from random import randint
from bs4 import BeautifulSoup
import requests



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
mydivs = soup.findAll("p", { "class" : "tweet-text" })[0].getText()
print str(mydivs)


print party
print twitter_handle
