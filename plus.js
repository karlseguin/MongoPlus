print('* MongoPlus is active (https://github.com/karlseguin/mongoplus)');

$ = function(str) {
  return ObjectId(str);
}
$.originals = {
  collection: {
    find: DBCollection.prototype.find,
    findOne: DBCollection.prototype.findOne,
    insert: DBCollection.prototype.insert,
    remove: DBCollection.prototype.remove,
    update: DBCollection.prototype.update,
    save: DBCollection.prototype.save
  },
  query: {
    shellPrint: DBQuery.prototype.shellPrint
  }
};


/* ObjectId Goodness */
$.implicit = function(b) {
  $._implicit = b;
}
ObjectId.prototype.toString = function(){
  return '$(' + tojson(this.str) + ')';
}

ObjectId.isValid = function(value) {return /^[0-9a-fA-F]{24}$/.test(value);}

DBCollection.prototype.find = function() {
  if (arguments.length > 0) { arguments[0] = $.implicitObjectIdTransform(arguments[0]); }
  return $.originals.collection.find.apply(this, arguments);
}
DBCollection.prototype.findOne = function() {
  if (arguments.length > 0) { arguments[0] = $.implicitObjectIdTransform(arguments[0]); }
  return $.originals.collection.findOne.apply(this, arguments);
}
DBCollection.prototype.insert = function() {
  if (arguments.length > 0) { arguments[0] = $.implicitObjectIdTransform(arguments[0]); }
  return $.originals.collection.insert.apply(this, arguments);
}
DBCollection.prototype.remove = function() {
  if (arguments.length > 0) { arguments[0] = $.implicitObjectIdTransform(arguments[0]); }
  return $.originals.collection.remove.apply(this, arguments);
}
DBCollection.prototype.update = function() {
  if (arguments.length > 0) { arguments[0] = $.implicitObjectIdTransform(arguments[0]); }
  if (arguments.length > 1) { arguments[1] = $.implicitObjectIdTransform(arguments[1]); }
  return $.originals.collection.update.apply(this, arguments);
}
DBCollection.prototype.save = function() {
  if (arguments.length > 0) { arguments[0] = $.implicitObjectIdTransform(arguments[0]); }
  return $.originals.collection.save.apply(this, arguments);
}

$.implicitObjectIdTransform = function(q) {
  if (!$._implicit) { return q; }
  for (var key in q) {
    if (!q.hasOwnProperty(key)) {continue;}
    var value = q[key];
    if (value == null) {continue;}
       
    var type = typeof(value);
    if (type == 'object' && !value.isObjectId) {
      q[key] = $.implicitObjectIdTransform(value)
    } 
    else if (type == 'string' && ObjectId.isValid(value)) {
      q[key] = new ObjectId(value);
    }
  }
  return q;
}


/* Find Output */
DBQuery.prototype.shellPrint = function() {
  var n = 0;
  try {
    while (this.hasNext() && n < (this._limit || DBQuery.shellBatchSize)) {
      print(this._prettyShell ? tojson( this.next() ) : tojson( this.next() , "" , true ));
      n++;
    }
    var explain = this.explain()
    console.log('Fetched %d of %d record%s in %dms via %s', n, this.count(), n == 1 ? '' : 's', explain.millis, explain.cursor);
    if (this.hasNext()){
      print('Type "it" for more');
      ___it___  = this;
    }
    else { ___it___  = null; }
  }
  catch (e){ print(e); }
}


/* Misc */
function limit(count) { DBQuery.shellBatchSize = count; }

var console = {
  formatters: /%[sdj]/g,
  log: function(f) {
    if (arguments.length == 0) { print(''); return; }
    var i = 1;
    var args = arguments;
    var str = String(f).replace(console.formatters, function(x) {
      switch (x) {
        case '%s': return String(args[i++]);
        case '%d': return Number(args[i++]);
        case '%j': return tojson(args[i++]);
        default: return x;
      }
    });
    for (var len = args.length, x = args[i]; i < len; x = args[++i]) {
      if (x === null || typeof x !== 'object') {
        str += ' ' + x;
      } else {
        str += ' ' + tojson(x);
      }
    }
    print(str);
  }
}

