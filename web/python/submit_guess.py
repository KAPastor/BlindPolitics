# Connect to the DB, take in a guess, and the other data and add to db
import sqlite3
import re
import json

## TEST:
# {"party":"Democrat","twitter_handle":"RepBera","tweet":"Hello This is a test","guess":"Democrat","location":"162.247.229.10"}

# conn_raw_tweet = sqlite3.connect('C:\Projects\BlindPolitics/data/user_guess.db')
conn_raw_tweet = sqlite3.connect('../data/user_guess.db')

pass_json = raw_input("")   # Python 2.x
pass_json = json.loads(pass_json)
tweet = pass_json['tweet']
party = pass_json['party']
twitter_handle = pass_json['twitter_handle']
guess = pass_json['guess']
location = pass_json['location']




c_raw_tweet = conn_raw_tweet.cursor()
tweet = tweet.replace('\'','').replace('\"','')
# Insert a row of data
insert_str = "INSERT INTO guess VALUES ('" + party + "','" + twitter_handle + "','" + tweet +"','"  + guess + "','"+ location  + "')"
c_raw_tweet.execute(insert_str)

# Save (commit) the changes
conn_raw_tweet.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn_raw_tweet.close()

# Now for the splitting of the words etc:
# conn_stats = sqlite3.connect('C:\Projects\BlindPolitics/data/twitter_stats.db')
conn_stats = sqlite3.connect('../data/twitter_stats.db')

c_stats = conn_stats.cursor()
# What we are going to do here is split up the words based on spaces using the methods in collective intellegence
words = re.compile(r'[^A-Z^a-z]+').split(tweet)
words =  [word.lower( ) for word in words if word!='']
# Now we have a bunch of words.  Next we will see if the database currently has entries for this twitter handle and word combo
# For each word we need to get the records.  If empty we know we need to add a new row:

for word in words:
    q_get_row = "SELECT COUNT(*) FROM tweet_data WHERE twitterHandle='"+ twitter_handle +"' AND word='"+word+"'"
    c_stats.execute(q_get_row)
    num_count = c_stats.fetchone()

    if num_count[0]==0:
        # Need to add a new record:
        if guess == party:
            q_insert = "INSERT INTO tweet_data VALUES ('" + twitter_handle + "','" + party + "','" + word +"',1,1,0)"
        else:
            q_insert = "INSERT INTO tweet_data VALUES ('" + twitter_handle + "','" + party + "','" + word +"',1,0,1)"
        c_stats.execute(q_insert)
        conn_stats.commit()
    else:
        # Need to updated
        q_get_row = "SELECT * FROM tweet_data WHERE twitterHandle='"+ twitter_handle +"' AND word='"+word+"'"
        print "------------------- "
        print "------>  " + word
        print "------>  " + q_get_row

        c_stats.execute(q_get_row)
        data_row = c_stats.fetchone()
        print data_row
        print data_row[3] + 1
        print str(data_row[3] + 1)


        if guess == party:
            q_update = "UPDATE tweet_data SET total_guess_num = " + str(data_row[3] + 1) + " , correct_guess = "+str(data_row[4] + 1) + " WHERE twitterHandle='"+ twitter_handle +"' AND word='"+word+"'"
        else:
            q_update = "UPDATE tweet_data SET total_guess_num = " + str(data_row[3] + 1) + " , wrong_guess = "+str(data_row[5] + 1) + " WHERE twitterHandle='"+ twitter_handle +"' AND word='"+word+"'"
        print "------>  " + q_update

        c_stats.execute(q_update)
        conn_stats.commit()



# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn_stats.close()
