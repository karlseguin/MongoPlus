# MongoPlus
This is an extension file that aims to make the mongo shell more magical

It's pretty meager right now. Ideas/suggestions are welcome.

## How To Use
Launch the mongo shell with:

	mongo --shell plus.js

## ObjectId Stuff
`$` is now an alias for the ObjectId function:

	db.unicorns.find({_id: $('4cd6d7ba9ae3e75d74000005')});

You can also turn on implicit id conversion, via: `$.implicit(true)`, allowing:

	//works for find, findOne, update, remove, insert and save
	//could be dangerous, if you use strings that =~ [a-fA-F0-9]{24}
	db.unicorns.find({_id: '4cd6d7ba9ae3e75d74000005'});

Added `ObjectId.isValid()` method

## Limit
When your query specifies a `limit`, the default 20-document limit will be replaced (for the particular query only) with the specific limit.

Also, you can change the limit by using the `limit` function: `limit(100)`

## Find Output
This is largely based on the verboseOutput which will make it in 2.2 (I suspect), but the find output has been improved to show the record and time taken.

	`db.unicorns.find().limit(35)`
	....
	Fetched 35 of 262 records in 2ms via BasicCursor

## console.log
Added `console.log` which takes parameters:

	//also supports %j for json output
	console.log('Unicorn %s killed %d vampires', 'skully', 944);