# Connect to the DB, take in a guess, and the other data and add to db
import sqlite3
conn = sqlite3.connect('../data/user_guess.db')


party = raw_input("")   # Python 2.x
Handle = raw_input("")   # Python 2.x
tweet = raw_input("")   # Python 2.x
guess = raw_input("")   # Python 2.x
location = raw_input("")   # Python 2.x

c = conn.cursor()

# Insert a row of data
insert_str = "INSERT INTO guess VALUES ('" + party + "','" + Handle + "','" + tweet +"','"  + guess + "','"+ location  + "')"
c.execute(insert_str)

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()
