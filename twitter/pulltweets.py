import twitter
import os
import pandas as pd
import csv




api = twitter.Api(consumer_key='e6cWyDszXgWQvCz8Il4xGOSTU',
  consumer_secret='m9gpltGoM6FeB29aMSfGzldIvlvmyFfZxKDqd9ob6yxAmZPpFX',
  access_token_key='162937569-hb0X18I8z35lxn1qIglvmrF3knnyksYPG62Np0LF',
  access_token_secret='jyNXkIObmjYv8vf5P2Gn8whRKlH2V9AB6DsGCwuDtmDpY')

twitter_handle_path = './TwitterHandles.csv'
twitter_data = [];
with open(twitter_handle_path) as f:
	for i,line in enumerate(f):
		print i
		clean_list_orig = [x.strip() for x in line.split(',')]
		handle = clean_list_orig[1]
		print handle
		try:
			t = api.GetUserTimeline(screen_name=handle, count=200)
			tweets = [i.AsDict() for i in t]
			for t in tweets:
				clean_list = [x.strip() for x in line.split(',')]
				clean_list.append(t['text'].encode('utf-8'))
				twitter_data.append(clean_list)
		except:
			print "skipping...======"
			print handle
			print "skipping..."


# print twitter_data
with open("./output.csv", "wb") as f:
	writer = csv.writer(f)
	writer.writerows(twitter_data)
#
# t = api.GetUserTimeline(screen_name="KAPastor", count=100)
#
