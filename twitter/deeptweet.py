import os
import pandas as pd
import csv
import json
import numpy as np

os.environ['KERAS_BACKEND'] = 'cntk'

import keras

import keras.preprocessing.text as kpt
from keras.preprocessing.text import Tokenizer
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation


df = pd.read_csv('./output.csv')
train_x = df['Tweet'].tolist()
train_y = df['Party'].tolist()

max_words = 3000

# create the tokenizer
tokenizer = Tokenizer(num_words=max_words)
tokenizer.fit_on_texts(train_x)
dictionary = tokenizer.word_index
with open('dictionary.json', 'w') as dictionary_file:
	json.dump(dictionary, dictionary_file)

def convert_text_to_index_array(text):
	# one really important thing that `text_to_word_sequence` does
	# is make all texts the same length -- in this case, the length
	# of the longest text in the set.
	return [dictionary[word] for word in kpt.text_to_word_sequence(text)]

allWordIndices = []
# for each tweet, change each token to its ID in the Tokenizer's word_index
for text in train_x:
	wordIndices = convert_text_to_index_array(text)
	allWordIndices.append(wordIndices)

# now we have a list of all tweets converted to index arrays.
# cast as an array for future usage.
allWordIndices = np.asarray(allWordIndices)

# create one-hot matrices out of the indexed tweets
train_x = tokenizer.sequences_to_matrix(allWordIndices, mode='binary')
# treat the labels as categories
trafomed_label = [];
for y in train_y:
	if y in ['Democrat']:
		trafomed_label.append(0)
	else:
		trafomed_label.append(1)

train_y = keras.utils.to_categorical(trafomed_label, 2)



model = Sequential()
model.add(Dense(512, input_shape=(max_words,), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(256, activation='sigmoid'))
model.add(Dropout(0.5))
model.add(Dense(2, activation='softmax'))

model.compile(loss='categorical_crossentropy',
  optimizer='adam',
  metrics=['accuracy'])


model.fit(train_x, train_y,
  batch_size=32,
  epochs=5,
  verbose=1,
  validation_split=0.1,
  shuffle=True)


model_json = model.to_json()
with open('model.json', 'w') as json_file:
	json_file.write(model_json)

model.save_weights('model.h5')
