import json
import numpy as np
import os
import twitter
os.environ['KERAS_BACKEND'] = 'cntk'

import keras

import keras.preprocessing.text as kpt
from keras.preprocessing.text import Tokenizer
from keras.models import model_from_json


proxy = 'https://gateway.bns:8000'
os.environ['http_proxy'] = proxy
os.environ['HTTP_PROXY'] = proxy
os.environ['https_proxy'] = proxy
os.environ['HTTPS_PROXY'] = proxy




# we're still going to use a Tokenizer here, but we don't need to fit it
tokenizer = Tokenizer(num_words=3000)
# for human-friendly printing
labels = ['dem', 'rep']

# read in our saved dictionary
with open('dictionary.json', 'r') as dictionary_file:
	dictionary = json.load(dictionary_file)

# this utility makes sure that all the words in your input
# are registered in the dictionary
# before trying to turn them into a matrix.
def convert_text_to_index_array(text):
	words = kpt.text_to_word_sequence(text)
	wordIndices = []
	for word in words:
		if word in dictionary:
			wordIndices.append(dictionary[word])
		else:
			print("'%s' not in training corpus; ignoring." %(word))
	return wordIndices

# read in your saved model structure
json_file = open('model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
# and create a model from that
model = model_from_json(loaded_model_json)
# and weight your nodes with your saved values
model.load_weights('model.h5')


api = twitter.Api(consumer_key='e6cWyDszXgWQvCz8Il4xGOSTU',
  consumer_secret='m9gpltGoM6FeB29aMSfGzldIvlvmyFfZxKDqd9ob6yxAmZPpFX',
  access_token_key='162937569-hb0X18I8z35lxn1qIglvmrF3knnyksYPG62Np0LF',
  access_token_secret='jyNXkIObmjYv8vf5P2Gn8whRKlH2V9AB6DsGCwuDtmDpY')

# okay here's the interactive part
while 1:
	handle = raw_input('Enter your Twitter Handle: ')
	if len(handle) == 0:
		break

	t = api.GetUserTimeline(screen_name=handle, count=200)
	tweets = [i.AsDict() for i in t]
	# Take the clean list of tweets and run the model.  Get the average, most dem and most preprocessing
	tweet_rank = []
	tweet_list = []
	for t in tweets:
		testArr = convert_text_to_index_array(t['text'].encode('utf-8'))
		tweet_list.append(t['text'].encode('utf-8'))
		input = tokenizer.sequences_to_matrix([testArr], mode='binary')
		pred = model.predict(input)
		tweet_rank.append(pred[0][0])

	m = max(tweet_rank)
	max_loc = [i for i, j in enumerate(tweet_rank) if j == m]
	print "Most Democratic Tweet::::::"
	print tweet_list[max_loc[0]]
	print m

	m = min(tweet_rank)
	min_loc = [i for i, j in enumerate(tweet_rank) if j == m]
	print "Most Republican Tweet::::::"
	print tweet_list[min_loc[0]]
	print m

	print "How you lean (Pct democrat): "
	print	sum(tweet_rank)/len(tweet_rank)
