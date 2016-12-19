var require = meteorInstall({"index.js":["babel-runtime/helpers/typeof",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// index.js                                                                                                          //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var _typeof;module.import('babel-runtime/helpers/typeof',{"default":function(v){_typeof=v}});                        //
//************************************************************************************************Start Of Globals   //
Markers = new Mongo.Collection('markers');                                                                           // 2
Friends = new Meteor.Collection('friends');                                                                          // 3
Members = new Meteor.Collection('members');                                                                          // 4
Requests = new Meteor.Collection('requests');                                                                        // 5
Notifications = new Meteor.Collection('notifications');                                                              // 6
Kontacts = new Meteor.Collection('kontacts');                                                                        // 7
                                                                                                                     //
if (Meteor.isClient) {                                                                                               // 9
                                                                                                                     //
  Meteor.startup(function () {                                                                                       // 11
    Kontacts.allow({                                                                                                 // 12
                                                                                                                     //
      insert: function insert(document) {                                                                            // 14
        return true;                                                                                                 // 15
      },                                                                                                             // 16
      update: function update() {                                                                                    // 17
        return true;                                                                                                 // 18
      },                                                                                                             // 19
      remove: function remove() {                                                                                    // 20
        return true;                                                                                                 // 21
      }                                                                                                              // 22
    });                                                                                                              // 12
  });                                                                                                                // 25
}                                                                                                                    // 28
                                                                                                                     //
//************************************************************************************************End Of Globals     //
                                                                                                                     //
//************************************************************************************************Start Of Cordova Back Button
if (Meteor.isCordova) {                                                                                              // 33
  var onBackKeyDown = function onBackKeyDown(e) {                                                                    // 33
    e.preventDefault();                                                                                              // 53
    console.log('back button triggered');                                                                            // 54
  };                                                                                                                 // 55
                                                                                                                     //
  /**                                                                                                                //
  document.addEventListener("deviceready", onDeviceReady, false);                                                    //
  function onDeviceReady(){                                                                                          //
     document.addEventListener("backbutton", function(e){                                                            //
        if($.mobile.activePage.is('.bv')){                                                                           //
            e.preventDefault();                                                                                      //
            navigator.app.exitApp();                                                                                 //
        }                                                                                                            //
        else {                                                                                                       //
            navigator.app.backHistory()                                                                              //
        }                                                                                                            //
     }, false);                                                                                                      //
  }                                                                                                                  //
  */                                                                                                                 //
                                                                                                                     //
  document.addEventListener("backbutton", onBackKeyDown, false);                                                     // 50
                                                                                                                     //
  Meteor.startup(function () {                                                                                       // 57
    document.addEventListener('deviceready', function () {                                                           // 58
      // Android customization                                                                                       //
      cordova.plugins.backgroundMode.setDefaults({ text: 'Doing heavy tasks.' });                                    // 60
      // Enable background mode                                                                                      //
      cordova.plugins.backgroundMode.enable();                                                                       // 62
      // Called when background mode has been activated                                                              //
      cordova.plugins.backgroundMode.onactivate = function () {                                                      // 64
        var mynumber = Session.get('telephoneNumber');                                                               // 65
        var kount = Notifications.find({ eventownernumber: mynumber }).count();                                      // 66
        //var allnotices = Notifications.findOne({eventownernumber:mynumber}).noticemessage;                         //
        console.log(kount);                                                                                          // 68
        var wn = Math.floor(Math.random() * 200);                                                                    // 69
        Session.set("mynum", kount);                                                                                 // 70
        //var uo = Notifications.findOne({eventownernumber:mynumber},{sort: {noticedate: -1}});                      //
        //console.log("second test",uo.noticemessage);                                                               //
        // var allnotices = uo.noticemessage;                                                                        //
        if (kount == 0) {                                                                                            // 74
          console.log('there is no notification to display');                                                        // 75
        } else {                                                                                                     // 76
          var uo = Notifications.findOne({ eventownernumber: mynumber }, { sort: { noticedate: -1 } });              // 78
          console.log("second test", uo.noticemessage);                                                              // 79
          var allnotices = uo.noticemessage;                                                                         // 80
          cordova.plugins.notification.local.add({ id: wn, title: 'New Notification Alert', message: allnotices });  // 81
        }                                                                                                            // 82
        //alert('kount changed');                                                                                    //
        /**                                                                                                          //
        this.sessionWatcher = Session.watch('mynum', function(value) {                                               //
         });                                                                                                         //
         */                                                                                                          //
      };                                                                                                             // 88
    }, false);                                                                                                       // 89
  });                                                                                                                // 90
}                                                                                                                    // 91
//************************************************************************************************End of cordova back button
                                                                                                                     //
//**************************************************************************Start Of collections                     //
                                                                                                                     //
if (Meteor.isClient) {                                                                                               // 97
                                                                                                                     //
  Notifications.allow({                                                                                              // 99
                                                                                                                     //
    insert: function insert(document) {                                                                              // 101
      return true;                                                                                                   // 102
    },                                                                                                               // 103
    update: function update() {                                                                                      // 104
      return true;                                                                                                   // 105
    },                                                                                                               // 106
    remove: function remove() {                                                                                      // 107
      return true;                                                                                                   // 108
    }                                                                                                                // 109
  });                                                                                                                // 99
                                                                                                                     //
  Meteor.subscribe('notifications');                                                                                 // 112
}                                                                                                                    // 114
//**************************************************************************End Of collections                       //
                                                                                                                     //
//**************************************************************************Start Of collections                     //
if (Meteor.isServer) {                                                                                               // 119
                                                                                                                     //
  Meteor.publish('members', function () {                                                                            // 121
    return Members.find();                                                                                           // 122
  });                                                                                                                // 123
                                                                                                                     //
  Meteor.publish('kontacts', function () {                                                                           // 125
    return Kontacts.find();                                                                                          // 126
  });                                                                                                                // 127
                                                                                                                     //
  Meteor.publish('markers', function () {                                                                            // 129
    return Markers.find();                                                                                           // 130
  });                                                                                                                // 131
                                                                                                                     //
  Meteor.publish('notifications', function () {                                                                      // 133
    return Notifications.find();                                                                                     // 134
  });                                                                                                                // 135
                                                                                                                     //
  Members.allow({                                                                                                    // 137
                                                                                                                     //
    insert: function insert(document) {                                                                              // 139
      return true;                                                                                                   // 140
    },                                                                                                               // 141
    update: function update() {                                                                                      // 142
      return true;                                                                                                   // 143
    },                                                                                                               // 144
    remove: function remove() {                                                                                      // 145
      return true;                                                                                                   // 146
    }                                                                                                                // 147
  });                                                                                                                // 137
                                                                                                                     //
  Notifications.allow({                                                                                              // 150
                                                                                                                     //
    insert: function insert(document) {                                                                              // 152
      return true;                                                                                                   // 153
    },                                                                                                               // 154
    update: function update() {                                                                                      // 155
      return true;                                                                                                   // 156
    },                                                                                                               // 157
    remove: function remove() {                                                                                      // 158
      return true;                                                                                                   // 159
    }                                                                                                                // 160
  });                                                                                                                // 150
}                                                                                                                    // 163
//**************************************************************************End Of collections                       //
                                                                                                                     //
//**************************************************************************Start Of methods                         //
Meteor.methods({                                                                                                     // 168
  'updatenumber': function updatenumber(tn, names, cl) {                                                             // 169
    Members.update({ telephoneNumber: tn }, { $set: { "names": names, "currentLocation": cl } }, { upsert: true });  // 170
  },                                                                                                                 // 171
  'join_upsert': function join_upsert(join_upsert_selector, theowner, theid) {                                       // 172
    console.log(join_upsert_selector);                                                                               // 173
    Markers.update({ eventoriginalid: theid }, { $set: join_upsert_selector }, { upsert: true });                    // 174
  },                                                                                                                 // 175
  'edit_notification_upsert': function edit_notification_upsert(edit_upsert_selector, niq) {                         // 176
    Notifications.update({ eventuniqueid: niq }, { $set: edit_upsert_selector }, { upsert: true });                  // 177
  },                                                                                                                 // 178
  'notification_upsert': function notification_upsert(notifications_upsert_selector, markerid) {                     // 179
    console.log(notifications_upsert_selector);                                                                      // 180
    Notifications.update({ eventoriginalid: markerid }, { $set: notifications_upsert_selector }, { upsert: true });  // 181
  },                                                                                                                 // 182
  'leave_event': function leave_event(theid, thenumber) {                                                            // 183
    console.log(theid);                                                                                              // 184
    console.log(thenumber);                                                                                          // 185
    //Meteor.call('leave_event',theid,thenumber);                                                                    //
    //Markers.remove({"eventoriginalid":theid},{"eventjoinernumber":thenumber});                                     //
    //remove method                                                                                                  //
    Markers.remove({ eventoriginalid: theid }, { eventjoinernumber: thenumber }, { eventtype: 'copy' });             // 189
  },                                                                                                                 // 190
  'leave_event_upsert': function leave_event_upsert(theid) {                                                         // 191
    console.log(notifications_upsert_selector);                                                                      // 192
    Notifications.update({ eventoriginalid: markerid }, { $set: notifications_upsert_selector }, { upsert: true });  // 193
  }                                                                                                                  // 194
});                                                                                                                  // 168
                                                                                                                     //
//**************************************************************************End of methods                           //
                                                                                                                     //
//**************************************************************************Client side templates code               //
if (Meteor.isClient) {                                                                                               // 202
                                                                                                                     //
  Template.search.onRendered(function () {                                                                           // 204
    $(".sr").click(function () {                                                                                     // 205
      Session.set('thetitle', null);                                                                                 // 206
    });                                                                                                              // 207
  });                                                                                                                // 208
                                                                                                                     //
  Template.note.helpers({                                                                                            // 210
    invites: function invites() {                                                                                    // 211
      var eventop = Session.get('telephoneNumber');                                                                  // 212
      return Notifications.find({ eventownernumber: eventop });                                                      // 213
    }                                                                                                                // 214
  });                                                                                                                // 210
  Template.search.helpers({                                                                                          // 216
    searchresults: function searchresults() {                                                                        // 217
      var thename = Session.get('thename');                                                                          // 218
      var thelocation = Session.get('thelocation');;                                                                 // 219
      var thetitle = Session.get('thetitle');;                                                                       // 220
                                                                                                                     //
      var search = new RegExp(thetitle, 'i');                                                                        // 222
      return Markers.find({ eventtitle: { $regex: search } });                                                       // 223
    }                                                                                                                // 224
  });                                                                                                                // 216
                                                                                                                     //
  Template.search.events({                                                                                           // 227
                                                                                                                     //
    'submit': function submit(event, template) {                                                                     // 229
      event.preventDefault();                                                                                        // 230
      var thename = event.target.thename.value;                                                                      // 231
      var thelocation = event.target.thelocation.value;                                                              // 232
      var thetitle = event.target.thetitle.value;                                                                    // 233
      Session.set('thename', thename);                                                                               // 234
      Session.set('thelocation', thelocation);                                                                       // 235
      Session.set('thetitle', thetitle);                                                                             // 236
    }                                                                                                                // 237
                                                                                                                     //
  });                                                                                                                // 227
                                                                                                                     //
  Template.note.events({                                                                                             // 242
                                                                                                                     //
    'click .notify': function clickNotify(event, template) {                                                         // 244
      event.preventDefault();                                                                                        // 245
      var latLng = Geolocation.latLng();                                                                             // 246
                                                                                                                     //
      var thecoords = JSON.parse(localStorage.getItem('jc'));                                                        // 248
      var unparsed = localStorage.getItem('jc');                                                                     // 249
      var str = toString(thecoords);                                                                                 // 250
      console.log(thecoords);                                                                                        // 251
      console.log(unparsed);                                                                                         // 252
      var mylat = parseFloat(thecoords.lat);                                                                         // 253
      var mylng = parseFloat(thecoords.lng);                                                                         // 254
                                                                                                                     //
      console.log(mylat);                                                                                            // 256
      console.log(mylng);                                                                                            // 257
                                                                                                                     //
      var tlat = '{"lat":' + mylat;                                                                                  // 259
      var tlng = '"lng":' + mylng + '}';                                                                             // 260
      var tkomma = ',';                                                                                              // 261
                                                                                                                     //
      var tlit = tlat + tkomma + tlng;                                                                               // 263
                                                                                                                     //
      var center = new google.maps.LatLng(mylat, mylng);                                                             // 266
                                                                                                                     //
      console.log(tlit);                                                                                             // 268
                                                                                                                     //
      //var icon = '';                                                                                               //
      var icon = 'https://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png';                                     // 272
                                                                                                                     //
      var myApp = new Framework7();                                                                                  // 274
                                                                                                                     //
      var $$ = Dom7;                                                                                                 // 276
                                                                                                                     //
      var popupHTML = '<div class="popup login-screen">' + '<div class="content-block">' + 'hello world' + '<p><a href="#" class="close-popup">Close me</a></p>' + '</div>' + '</div>';
      myApp.popup(popupHTML);                                                                                        // 284
      map.panTo(center);                                                                                             // 285
      //marker.setIcon(icon);                                                                                        //
      //window.location.href = link;                                                                                 //
    }                                                                                                                // 288
                                                                                                                     //
  });                                                                                                                // 242
                                                                                                                     //
  Template.ikon.onRendered(function () {                                                                             // 292
    Session.get('telephoneNumber');                                                                                  // 293
  });                                                                                                                // 294
                                                                                                                     //
  Template.ikon.events({                                                                                             // 297
    'click #gotoposition': function clickGotoposition(event, template) {                                             // 298
      event.preventDefault();                                                                                        // 299
      Meteor.subscribe('notifications');                                                                             // 300
      var tell = Session.get('telephoneNumber');                                                                     // 301
      var tellx = "'" + tell + "'";                                                                                  // 302
      //var allnotices = Notifications.findOne({"eventownernumber":tell}).noticemessage;                             //
      //var allnotices = Notifications.findOne({eventownernumber:"2"}).noticemessage;                                //
      //var allnotices = Notifications.find({eventownernumber:"2"}).fetch()[0].noticemessage;                        //
                                                                                                                     //
      var ex = Notifications.find({ eventownernumber: tell }).fetch().reverse().map(function (c) {                   // 307
        //return {value: c.noticemessage};                                                                           //
        return c.noticemessage;                                                                                      // 309
      });                                                                                                            // 310
                                                                                                                     //
      console.log("first test", ex);                                                                                 // 312
      var uo = Notifications.findOne({ eventownernumber: tell }, { sort: { noticedate: -1 } });                      // 313
      console.log("second test", uo.noticemessage);                                                                  // 314
      //var latinum = Notifications.findOne({eventownernumber:tell}, {fields: {'noticemessage': 1}});                //
      //var allnotices = 'testing';                                                                                  //
      console.log('checkout stuff');                                                                                 // 317
      //console.log('Telephone Number'+tellx);                                                                       //
                                                                                                                     //
      var latLng = Geolocation.latLng();                                                                             // 321
                                                                                                                     //
      //var map = google.maps.Map(document.getElementById("map"));                                                   //
                                                                                                                     //
      var center = new google.maps.LatLng(latLng.lat, latLng.lng);                                                   // 325
                                                                                                                     //
      var icon = '';                                                                                                 // 327
      //var icon = 'https://maps.google.com/mapfiles/kml/pushpin/pink-pushpin.png';                                  //
                                                                                                                     //
      map.panTo(center);                                                                                             // 330
    }                                                                                                                // 331
                                                                                                                     //
  });                                                                                                                // 297
  Template.ikon.helpers({                                                                                            // 334
    thecount: function thecount() {                                                                                  // 335
      var mynumber = Session.get('telephoneNumber');                                                                 // 336
      return Markers.find({ $or: [{ publicevent: "yes" }, { primaryowner: mynumber }, { invited: mynumber }] }).count();
    }                                                                                                                // 338
  });                                                                                                                // 334
                                                                                                                     //
  Meteor.subscribe('members');                                                                                       // 341
  Meteor.subscribe('notifications');                                                                                 // 342
  Meteor.subscribe('kontacts');                                                                                      // 343
                                                                                                                     //
  Kontacts.allow({                                                                                                   // 345
                                                                                                                     //
    insert: function insert(document) {                                                                              // 347
      return true;                                                                                                   // 348
    },                                                                                                               // 349
    update: function update() {                                                                                      // 350
      return true;                                                                                                   // 351
    },                                                                                                               // 352
    remove: function remove() {                                                                                      // 353
      return true;                                                                                                   // 354
    }                                                                                                                // 355
  });                                                                                                                // 345
                                                                                                                     //
  Notifications.allow({                                                                                              // 358
                                                                                                                     //
    insert: function insert(document) {                                                                              // 360
      return true;                                                                                                   // 361
    },                                                                                                               // 362
    update: function update() {                                                                                      // 363
      return true;                                                                                                   // 364
    },                                                                                                               // 365
    remove: function remove() {                                                                                      // 366
      return true;                                                                                                   // 367
    }                                                                                                                // 368
  });                                                                                                                // 358
                                                                                                                     //
  Members.allow({                                                                                                    // 371
                                                                                                                     //
    insert: function insert(document) {                                                                              // 373
      return true;                                                                                                   // 374
    },                                                                                                               // 375
    update: function update() {                                                                                      // 376
      return true;                                                                                                   // 377
    },                                                                                                               // 378
    remove: function remove() {                                                                                      // 379
      return true;                                                                                                   // 380
    }                                                                                                                // 381
  });                                                                                                                // 371
}                                                                                                                    // 383
                                                                                                                     //
//*************************************************************************End of client side code                   //
                                                                                                                     //
//**************************************************************************Start Of members                         //
                                                                                                                     //
if (Meteor.isServer) {                                                                                               // 389
  MembersSchema = new SimpleSchema({                                                                                 // 390
    telephoneNumber: {                                                                                               // 391
      type: String,                                                                                                  // 392
      label: 'Telephone Number',                                                                                     // 393
      max: 100                                                                                                       // 394
    },                                                                                                               // 391
    names: {                                                                                                         // 396
      type: String,                                                                                                  // 397
      label: 'Names',                                                                                                // 398
      max: 100                                                                                                       // 399
    },                                                                                                               // 396
    currentLocation: {                                                                                               // 401
      type: String,                                                                                                  // 402
      label: 'Current Location',                                                                                     // 403
      max: 100                                                                                                       // 404
    }                                                                                                                // 401
  });                                                                                                                // 390
  Members.attachSchema(MembersSchema);                                                                               // 407
}                                                                                                                    // 408
                                                                                                                     //
//**************************************************************************End of members                           //
                                                                                                                     //
//**************************************************************************Start Of collections                     //
//Notifications                                                                                                      //
if (Meteor.isClient) {                                                                                               // 414
  NoticeSchema = new SimpleSchema({                                                                                  // 415
    lat: {                                                                                                           // 416
      type: String,                                                                                                  // 417
      label: 'Latitude',                                                                                             // 418
      max: 100                                                                                                       // 419
    },                                                                                                               // 416
    lng: {                                                                                                           // 421
      type: String,                                                                                                  // 422
      label: 'Longitude',                                                                                            // 423
      max: 100                                                                                                       // 424
    },                                                                                                               // 421
    eventuniqueid: {                                                                                                 // 426
      type: String,                                                                                                  // 427
      label: 'Event Unique Id',                                                                                      // 428
      max: 100                                                                                                       // 429
    },                                                                                                               // 426
    eventownernumber: {                                                                                              // 431
      type: String,                                                                                                  // 432
      label: 'Event Owner Number',                                                                                   // 433
      max: 100                                                                                                       // 434
    },                                                                                                               // 431
    eventownernames: {                                                                                               // 436
      type: String,                                                                                                  // 437
      label: 'Event Owner Names',                                                                                    // 438
      max: 100                                                                                                       // 439
    },                                                                                                               // 436
    eventtitle: {                                                                                                    // 441
      type: String,                                                                                                  // 442
      label: 'Event Title',                                                                                          // 443
      max: 100                                                                                                       // 444
    },                                                                                                               // 441
    eventtime: {                                                                                                     // 446
      type: String,                                                                                                  // 447
      label: 'Event Time',                                                                                           // 448
      max: 100                                                                                                       // 449
    },                                                                                                               // 446
    invited: {                                                                                                       // 451
      type: String,                                                                                                  // 452
      label: 'Invited',                                                                                              // 453
      max: 100                                                                                                       // 454
    },                                                                                                               // 451
    eventduration: {                                                                                                 // 456
      type: String,                                                                                                  // 457
      label: 'Event Duration',                                                                                       // 458
      max: 100                                                                                                       // 459
    },                                                                                                               // 456
    eventtype: {                                                                                                     // 461
      type: String,                                                                                                  // 462
      label: 'Event Type',                                                                                           // 463
      max: 100                                                                                                       // 464
    },                                                                                                               // 461
    eventcategory: {                                                                                                 // 466
      type: String,                                                                                                  // 467
      label: 'Event Category',                                                                                       // 468
      max: 100                                                                                                       // 469
    },                                                                                                               // 466
    eventstatus: {                                                                                                   // 471
      type: String,                                                                                                  // 472
      label: 'Event Status',                                                                                         // 473
      max: 100                                                                                                       // 474
    },                                                                                                               // 471
    createdAt: {                                                                                                     // 476
      type: String,                                                                                                  // 477
      label: 'Created At',                                                                                           // 478
      max: 100                                                                                                       // 479
    },                                                                                                               // 476
    noticenumber: {                                                                                                  // 481
      type: String,                                                                                                  // 482
      label: 'Notification Number',                                                                                  // 483
      max: 100                                                                                                       // 484
    },                                                                                                               // 481
    noticenames: {                                                                                                   // 486
      type: String,                                                                                                  // 487
      label: 'Notification Names',                                                                                   // 488
      max: 100                                                                                                       // 489
    },                                                                                                               // 486
    noticemessage: {                                                                                                 // 491
      type: String,                                                                                                  // 492
      label: 'Notification Message',                                                                                 // 493
      max: 100                                                                                                       // 494
    },                                                                                                               // 491
    //{11:read},{12:unread}                                                                                          //
    noticestatus: {                                                                                                  // 497
      type: String,                                                                                                  // 498
      label: 'Notification Status',                                                                                  // 499
      max: 100                                                                                                       // 500
    },                                                                                                               // 497
    noticedate: {                                                                                                    // 502
      type: String,                                                                                                  // 503
      label: 'Notifice Date',                                                                                        // 504
      max: 100                                                                                                       // 505
    }                                                                                                                // 502
                                                                                                                     //
  });                                                                                                                // 415
  Notifications.attachSchema(NoticeSchema);                                                                          // 509
  //Markers                                                                                                          //
  EventsSchema = new SimpleSchema({                                                                                  // 511
    lat: {                                                                                                           // 512
      type: String,                                                                                                  // 513
      label: 'Latitude',                                                                                             // 514
      max: 100                                                                                                       // 515
    },                                                                                                               // 512
    lng: {                                                                                                           // 517
      type: String,                                                                                                  // 518
      label: 'Longitude',                                                                                            // 519
      max: 100                                                                                                       // 520
    },                                                                                                               // 517
    eventuniqueid: {                                                                                                 // 522
      type: String,                                                                                                  // 523
      label: 'Event Unique Id',                                                                                      // 524
      max: 100                                                                                                       // 525
    },                                                                                                               // 522
    eventownernumber: {                                                                                              // 527
      type: String,                                                                                                  // 528
      label: 'Event Owner Number',                                                                                   // 529
      max: 100                                                                                                       // 530
    },                                                                                                               // 527
    eventownernames: {                                                                                               // 532
      type: String,                                                                                                  // 533
      label: 'Event Owner Names',                                                                                    // 534
      max: 100                                                                                                       // 535
    },                                                                                                               // 532
    eventtitle: {                                                                                                    // 537
      type: String,                                                                                                  // 538
      label: 'Event Title',                                                                                          // 539
      max: 100                                                                                                       // 540
    },                                                                                                               // 537
    eventtime: {                                                                                                     // 542
      type: String,                                                                                                  // 543
      label: 'Event Time',                                                                                           // 544
      max: 100                                                                                                       // 545
    },                                                                                                               // 542
    invited: {                                                                                                       // 547
      type: String,                                                                                                  // 548
      label: 'Invited',                                                                                              // 549
      max: 100                                                                                                       // 550
    },                                                                                                               // 547
    eventduration: {                                                                                                 // 552
      type: String,                                                                                                  // 553
      label: 'Event Duration',                                                                                       // 554
      max: 100                                                                                                       // 555
    },                                                                                                               // 552
    //{public,private,{copy:join or leave}}                                                                          //
    eventtype: {                                                                                                     // 558
      type: String,                                                                                                  // 559
      label: 'Event Type',                                                                                           // 560
      max: 100                                                                                                       // 561
    },                                                                                                               // 558
    eventcategory: {                                                                                                 // 563
      type: String,                                                                                                  // 564
      label: 'Event Category',                                                                                       // 565
      max: 100                                                                                                       // 566
    },                                                                                                               // 563
    //{11:active},{12:expired},{13:marked as deleted}                                                                //
    eventstatus: {                                                                                                   // 569
      type: String,                                                                                                  // 570
      label: 'Event Status',                                                                                         // 571
      max: 100                                                                                                       // 572
    },                                                                                                               // 569
    eventoriginalid: {                                                                                               // 574
      type: String,                                                                                                  // 575
      label: 'Event Original Id',                                                                                    // 576
      max: 100                                                                                                       // 577
    },                                                                                                               // 574
    eventjoinernumber: {                                                                                             // 579
      type: String,                                                                                                  // 580
      label: 'Event Joiner Number',                                                                                  // 581
      max: 100                                                                                                       // 582
    },                                                                                                               // 579
    eventjoinernames: {                                                                                              // 584
      type: String,                                                                                                  // 585
      label: 'Event Joiner Names',                                                                                   // 586
      max: 100                                                                                                       // 587
    },                                                                                                               // 584
    eventjoindate: {                                                                                                 // 589
      type: String,                                                                                                  // 590
      label: 'Event Join Date',                                                                                      // 591
      max: 100                                                                                                       // 592
    },                                                                                                               // 589
    eventleavedate: {                                                                                                // 594
      type: String,                                                                                                  // 595
      label: 'Event Joiner Number',                                                                                  // 596
      max: 100                                                                                                       // 597
    },                                                                                                               // 594
    createdAt: {                                                                                                     // 599
      type: Date,                                                                                                    // 600
      label: 'Created At',                                                                                           // 601
      max: 100                                                                                                       // 602
    }                                                                                                                // 599
                                                                                                                     //
  });                                                                                                                // 511
  Markers.attachSchema(EventsSchema);                                                                                // 606
}                                                                                                                    // 607
                                                                                                                     //
//**************************************************************************End Of collections                       //
                                                                                                                     //
//**************************************************************************Start Of cordova notifications           //
if (Meteor.isCordova) {                                                                                              // 613
                                                                                                                     //
  Meteor.startup(function () {                                                                                       // 615
    cordova.plugins.notification.local.registerPermission(function (granted) {                                       // 616
      /**                                                                                                            //
       if(confirm("Geo Canada would like to send you notifications: ") === true) {                                   //
         //alert('permission granted '+granted)                                                                      //
       } else {                                                                                                      //
         //alert('permission denied')                                                                                //
       }                                                                                                             //
       */                                                                                                            //
    });                                                                                                              // 624
  });                                                                                                                // 626
}                                                                                                                    // 628
//**************************************************************************End of cordova notifications             //
                                                                                                                     //
//**************************************************************************Start Of startup                         //
Meteor.startup(function () {                                                                                         // 633
  if (Meteor.isServer) {                                                                                             // 634
    //Markers._ensureIndex({createdAt: 1}, {expireAfterSeconds: 60});                                                //
    if (Friends.find().count() === 0) {                                                                              // 636
      Friends.insert({ userid: 0, friendid: 0 });                                                                    // 637
    }                                                                                                                // 638
    if (Requests.find().count() === 0) {                                                                             // 639
      Requests.insert({ userid: 0, friendid: 0 });                                                                   // 640
    }                                                                                                                // 641
  }                                                                                                                  // 642
});                                                                                                                  // 643
                                                                                                                     //
//************************************************************** End of startup                                      //
                                                                                                                     //
//**************************************************************************Start of client                          //
                                                                                                                     //
if (Meteor.isClient) {                                                                                               // 650
  Meteor.subscribe('kontacts');                                                                                      // 651
  Meteor.startup(function () {                                                                                       // 652
                                                                                                                     //
    console.log('hello');                                                                                            // 654
    GoogleMaps.load({                                                                                                // 655
      key: 'AIzaSyD81kt-LoD3_Vqyqhd1yw9YlHq8J3SHpEg'                                                                 // 656
    });                                                                                                              // 655
  });                                                                                                                // 658
                                                                                                                     //
  Template.telephone.events({                                                                                        // 660
                                                                                                                     //
    'submit form': function submitForm(event, template) {                                                            // 662
      event.preventDefault();                                                                                        // 663
      var tn = $('#telephoneNumber').val();                                                                          // 664
      var names = $('#names').val();                                                                                 // 665
      //call upsert function                                                                                         //
      var selector = {                                                                                               // 667
        telephoneNumber: tn                                                                                          // 668
      };                                                                                                             // 667
      var this_exists = Members.find(selector, { limit: 1 }).count() > 0;                                            // 670
                                                                                                                     //
      var latLng = Geolocation.latLng();                                                                             // 672
                                                                                                                     //
      var lat2 = latLng.lat;                                                                                         // 674
      var lng2 = latLng.lng;                                                                                         // 675
      var cl = lat2 + ',' + lng2;                                                                                    // 676
                                                                                                                     //
      if (this_exists == true) {                                                                                     // 678
        Meteor.call('updatenumber', tn, names, cl);                                                                  // 679
        Session.clearPersistent();                                                                                   // 680
        Session.setPersistent({ telephoneNumber: tn });                                                              // 681
        Session.setPersistent({ names: names });                                                                     // 682
        Session.setPersistent({ currentLocation: cl });                                                              // 683
      } else {                                                                                                       // 684
        Meteor.call('updatenumber', tn, names, cl);                                                                  // 685
        Session.clearPersistent();                                                                                   // 686
        Session.setPersistent({ telephoneNumber: tn });                                                              // 687
        Session.setPersistent({ names: names });                                                                     // 688
        Session.setPersistent({ currentLocation: cl });                                                              // 689
      }                                                                                                              // 690
    },                                                                                                               // 691
    'change #eventowner': function changeEventowner(event) {                                                         // 692
      alert($(event.target).val() + " Changed");                                                                     // 693
    }                                                                                                                // 694
  });                                                                                                                // 660
  Template.telephone.helpers({                                                                                       // 696
    tn: function tn() {                                                                                              // 697
      return Session.get('telephoneNumber');                                                                         // 698
    },                                                                                                               // 699
    names: function names() {                                                                                        // 700
      return Session.get('names');                                                                                   // 701
    },                                                                                                               // 702
    thecount: function thecount() {                                                                                  // 703
      var mynumber = Session.get('telephoneNumber');                                                                 // 704
      return Markers.find({ $or: [{ publicevent: "yes" }, { primaryowner: mynumber }, { invited: mynumber }] }).count();
    }                                                                                                                // 706
  });                                                                                                                // 696
                                                                                                                     //
  Template.map.events({                                                                                              // 709
    'click button.invite': function clickButtonInvite(event, template) {                                             // 710
      event.preventDefault();                                                                                        // 711
      alert('this connected');                                                                                       // 712
    }                                                                                                                // 713
  });                                                                                                                // 709
                                                                                                                     //
  Template.map.onCreated(function () {                                                                               // 716
    var latLng = Geolocation.latLng();                                                                               // 717
    var mynumber = Session.get('telephoneNumber');                                                                   // 718
                                                                                                                     //
    Tracker.autorun(function () {                                                                                    // 720
      if (Meteor.isCordova) {                                                                                        // 721
        var kount = Notifications.find({ eventownernumber: mynumber }).count();                                      // 722
        //var allnotices = Notifications.findOne({eventownernumber:mynumber}).noticemessage;                         //
        console.log(kount);                                                                                          // 724
        var wn = Math.floor(Math.random() * 200);                                                                    // 725
        Session.set("mynum", kount);                                                                                 // 726
        //var uo = Notifications.findOne({eventownernumber:mynumber},{sort: {noticedate: -1}});                      //
        //console.log("second test",uo.noticemessage);                                                               //
        // var allnotices = uo.noticemessage;                                                                        //
        if (kount == 0) {                                                                                            // 730
          console.log('there is no notification to display');                                                        // 731
        } else {                                                                                                     // 732
          var uo = Notifications.findOne({ eventownernumber: mynumber }, { sort: { noticedate: -1 } });              // 734
          console.log("second test", uo.noticemessage);                                                              // 735
          var allnotices = uo.noticemessage;                                                                         // 736
          cordova.plugins.notification.local.add({ id: wn, title: 'New Notification Alert', message: allnotices });  // 737
        }                                                                                                            // 738
        //alert('kount changed');                                                                                    //
        /**                                                                                                          //
        this.sessionWatcher = Session.watch('mynum', function(value) {                                               //
         });                                                                                                         //
         */                                                                                                          //
      }                                                                                                              // 744
    }), GoogleMaps.ready('map', function (map) {                                                                     // 745
      window.map = map.instance;                                                                                     // 749
                                                                                                                     //
      //**********************************************************************Start add marker                       //
      google.maps.event.addListener(map.instance, 'click', function (event) {                                        // 752
        if (Meteor.isCordova) {                                                                                      // 753
          localStorage.removeItem('entry');                                                                          // 754
          MyObject = {                                                                                               // 755
            ae: function ae(clicked_id) {                                                                            // 756
              var items = JSON.parse(localStorage.getItem('entry'));                                                 // 757
              if (items == null || (typeof items === 'undefined' ? 'undefined' : _typeof(items)) !== 'object') {     // 758
                items = [];                                                                                          // 759
              }                                                                                                      // 760
              var entry = {                                                                                          // 761
                'num': clicked_id                                                                                    // 762
              };                                                                                                     // 761
              items.push(entry);                                                                                     // 764
              localStorage.setItem('entry', JSON.stringify(items));                                                  // 765
              //alert(localStorage.getItem('entry'));                                                                //
            }                                                                                                        // 768
          };                                                                                                         // 755
                                                                                                                     //
          //list friends with the app installed                                                                      //
                                                                                                                     //
          var currentnumber = Session.get('telephoneNumber');                                                        // 773
          var sel = {                                                                                                // 774
            my_number: currentnumber                                                                                 // 775
          };                                                                                                         // 774
                                                                                                                     //
          var my_friends = Kontacts.find(sel).fetch();                                                               // 778
          //console.log(my_friends);                                                                                 //
          for (i in my_friends) {                                                                                    // 780
                                                                                                                     //
            var f_number = my_friends[i].contact_number;                                                             // 783
            var f_names = my_friends[i].contact_names;                                                               // 784
            var fand = {                                                                                             // 785
              telephoneNumber: f_number                                                                              // 786
            };                                                                                                       // 785
            var nord = Members.find(fand, { limit: 1 }).count() > 0;                                                 // 788
                                                                                                                     //
            if (nord == true) {                                                                                      // 790
              alert('true');                                                                                         // 791
              //$('.table tbody').append('<tr class="child"><td>'+f_names+'</td><td><button id="'+f_number+'" onClick="MyObject.ae(this.id);" type="button" class="invite btn btn-primary">Invite</button></td></tr>');
            }if (nord == false) {                                                                                    // 793
              console.log('false');                                                                                  // 794
            }                                                                                                        // 795
          }                                                                                                          // 797
                                                                                                                     //
          //end of list friend with the app installed                                                                //
        }                                                                                                            // 800
        var myApp = new Framework7();                                                                                // 801
                                                                                                                     //
        var $$ = Dom7;                                                                                               // 803
                                                                                                                     //
        var phtml = '<div class="cp popup">' + '<div class="row">' + '<div class="col-100">' + '<div class="buttons-row">' + '<a  href="#tab1" class="button active tab-link">Create Event</a>' + '<a  href="#tab2" class="button tab-link">Invite Friends</a>' + '</div>' + '<div class="tabs">' + '<div class="tab active" id="tab1">' + '<fieldset class="ml form-inline">' + '<label class="control-label">Event Title</label><br/>' + '<input type="text" class="form-control input-medium" id="eventtitle" value="" required/><br/>' + '<label class="control-label">Event Time</label><br/>' + '<input type="time" class="form-control input-medium" id="eventtime" value="" /><br/>' + '<label class="control-label">Event Duration In Minutes</label><br/>' + '<input type="number"  class="form-control input-medium" id="eventduration" value=""  /><br/>' + '<label class="control-label">Event Category</label><br/>' + '<select class="form-control input-medium" id="eventcategory" name="category">' + '<option value="hackathon">Hackathon</option>' + '<option value="birthday">Birthday</option>' + '<option value="barmitzvah">Bar Mitzvah</option>' + '</select><br/>' + '<label class="control-label">Event Type</label><br/>' + '<select class="form-control input-medium" id="eventtype">' + '<option value="private">Private</option>' + '<option value="public">Public</option>' + '</select><br/>' + '<button class="pull-left kancel btn btn-success close-popup">Close</button>' + '<button class="pull-right ce btn btn-success close-popup">Create Event</button>' + '</fieldset>' + '</div>' + '<div class="tab" id="tab2"><table class="table ml table-striped">' + '<thead>' + '<tr>' + '<th>Names</th>' + '<th>Action</th>' + '</tr>' + '</thead>' + '<tbody>' + '</tbody>' + '</table></div>' + '</div>' + '</div>' + '</div>' + '</div>';
        $$('.popup').remove(phtml);                                                                                  // 852
        myApp.popup(phtml);                                                                                          // 853
        //$('.custompopup').append(phtml);                                                                           //
        //$('.popup').height(300);                                                                                   //
        $$(".kancel").click(function () {                                                                            // 856
          console.log('cancel');                                                                                     // 857
          var et = $('#eventtitle').val();                                                                           // 858
          var evd = $('#eventduration').val();                                                                       // 859
          var ec = $('#eventcategory').val();                                                                        // 860
          var etype = $('#eventtype').val();                                                                         // 861
          var etime = $('#eventtime').val();                                                                         // 862
          var invited = localStorage.getItem('entry');                                                               // 863
          var lat = event.latLng.lat();                                                                              // 864
          var lng = event.latLng.lng();                                                                              // 865
          var currentnumber = Session.get('telephoneNumber');                                                        // 866
          var currentnames = Session.get('names');                                                                   // 867
                                                                                                                     //
          Markers.insert({                                                                                           // 869
            lat: lat,                                                                                                // 870
            lng: lng,                                                                                                // 871
            eventuniqueid: Random.id(),                                                                              // 872
            eventownernumber: currentnumber,                                                                         // 873
            eventownernames: currentnames,                                                                           // 874
            eventtitle: 'dismissed',                                                                                 // 875
            eventtime: '00:00',                                                                                      // 876
            invited: '0',                                                                                            // 877
            eventduration: '60',                                                                                     // 878
            eventtype: 'public',                                                                                     // 879
            eventcategory: 'dismissed',                                                                              // 880
            //{11:active},{12:expired},{13:marked as deleted}                                                        //
            eventstatus: '11',                                                                                       // 882
            eventoriginalid: '0',                                                                                    // 883
            eventjoinernumber: '0',                                                                                  // 884
            eventjoinernames: '0',                                                                                   // 885
            eventjoindate: '0',                                                                                      // 886
            eventleavedate: '0',                                                                                     // 887
            createdAt: new Date()                                                                                    // 888
          });                                                                                                        // 869
        });                                                                                                          // 890
                                                                                                                     //
        $$(".ce").click(function () {                                                                                // 892
                                                                                                                     //
          var et = $('#eventtitle').val();                                                                           // 894
          var evd = $('#eventduration').val();                                                                       // 895
          var ec = $('#eventcategory').val();                                                                        // 896
          var etype = $('#eventtype').val();                                                                         // 897
          var etime = $('#eventtime').val();                                                                         // 898
          var invited = localStorage.getItem('entry');                                                               // 899
          var lat = event.latLng.lat();                                                                              // 900
          var lng = event.latLng.lng();                                                                              // 901
          var currentnumber = Session.get('telephoneNumber');                                                        // 902
          var currentnames = Session.get('names');                                                                   // 903
          var ri = Random.id();                                                                                      // 904
                                                                                                                     //
          Markers.insert({                                                                                           // 906
            lat: lat,                                                                                                // 907
            lng: lng,                                                                                                // 908
            eventuniqueid: ri,                                                                                       // 909
            eventownernumber: currentnumber,                                                                         // 910
            eventownernames: currentnames,                                                                           // 911
            eventtitle: et,                                                                                          // 912
            eventtime: etime,                                                                                        // 913
            invited: '0',                                                                                            // 914
            eventduration: evd,                                                                                      // 915
            eventtype: etype,                                                                                        // 916
            eventcategory: ec,                                                                                       // 917
            //{11:active},{12:expired},{13:marked as deleted}                                                        //
            eventstatus: '11',                                                                                       // 919
            eventoriginalid: '0',                                                                                    // 920
            eventjoinernumber: '0',                                                                                  // 921
            eventjoinernames: '0',                                                                                   // 922
            eventjoindate: '0',                                                                                      // 923
            eventleavedate: '0',                                                                                     // 924
            createdAt: new Date()                                                                                    // 925
          });                                                                                                        // 906
                                                                                                                     //
          var inv = JSON.parse(invited);                                                                             // 928
                                                                                                                     //
          var myArray = inv;                                                                                         // 930
          for (var i = 0, length = myArray.length; i < length; i++) {                                                // 931
            var o = myArray[i];                                                                                      // 932
            for (var p in o) {                                                                                       // 933
              console.log(o[p]);                                                                                     // 934
                                                                                                                     //
              Markers.insert({                                                                                       // 936
                lat: lat,                                                                                            // 937
                lng: lng,                                                                                            // 938
                eventuniqueid: ri,                                                                                   // 939
                eventownernumber: currentnumber,                                                                     // 940
                eventownernames: currentnames,                                                                       // 941
                eventtitle: et,                                                                                      // 942
                eventtime: etime,                                                                                    // 943
                invited: o[p],                                                                                       // 944
                eventduration: evd,                                                                                  // 945
                eventtype: etype,                                                                                    // 946
                eventcategory: ec,                                                                                   // 947
                //{11:active},{12:expired},{13:marked as deleted}                                                    //
                eventstatus: '11',                                                                                   // 949
                eventoriginalid: '0',                                                                                // 950
                eventjoinernumber: '0',                                                                              // 951
                eventjoinernames: '0',                                                                               // 952
                eventjoindate: '0',                                                                                  // 953
                eventleavedate: '0',                                                                                 // 954
                createdAt: new Date()                                                                                // 955
              });                                                                                                    // 936
            }                                                                                                        // 958
          }                                                                                                          // 959
                                                                                                                     //
          myApp.closeModal('.cp');                                                                                   // 961
        });                                                                                                          // 962
      });                                                                                                            // 964
      //*********************************************************************End add marker                          //
      //db.markers.find( { $or: [ { publicevent: "yes" }, { primaryowner:"0720069005" },{invited:"0720069005"} ] } )
                                                                                                                     //
      //**********************************************************************Start list markers                     //
                                                                                                                     //
      var markers = {};                                                                                              // 971
                                                                                                                     //
      var mynumber = Session.get('telephoneNumber');                                                                 // 974
      // Markers.find({ $or: [ { publicevent: "yes" },{joinstatus:"14"}, { primaryowner:mynumber },{invited:mynumber} ] } ).observe({
      //Markers.find({ $or: [ {joinstatus:"14"},{ primaryowner:mynumber }] } ).observe({                             //
      Markers.find({                                                                                                 // 977
        $or: [{ eventtype: 'private', eventownernumber: mynumber, eventstatus: '11' }, { eventtype: 'public', eventownernumber: mynumber, eventstatus: '11' }, { eventtype: 'public', eventownernumber: { $ne: mynumber }, eventstatus: '11' }, { invited: mynumber, eventstatus: '11' }] }).observe({
        //**********************************************************************Start list markers                   //
        added: function added(document) {                                                                            // 985
          var icon;                                                                                                  // 986
          var drg;                                                                                                   // 987
          var infoWindow;                                                                                            // 988
          var marker;                                                                                                // 989
          /**                                                                                                        //
             {                                                                                                       //
          "_id": "J6f8aPzd4DESzK2Hr",                                                                                //
          "eventoriginalid": "795ke9b6irkJFHAku",                                                                    //
          "lat": "-1.2637544065804518",                                                                              //
          "lng": "36.895437240600586",                                                                               //
          "eventuniqueid": "eQCGWtrHPCi9cNwYC",                                                                      //
          "eventownernumber": "2",                                                                                   //
          "eventownernames": "Stuff two",                                                                            //
          "eventtitle": "First public",                                                                              //
          "eventtime": "17:49",                                                                                      //
          "invited": "0",                                                                                            //
          "eventduration": "30",                                                                                     //
          "eventtype": "copy",                                                                                       //
          "eventcategory": "hackathon",                                                                              //
          "eventstatus": "11",                                                                                       //
          "eventjoinernumber": "1",                                                                                  //
          "eventjoinernames": "Test 1",                                                                              //
          "eventjoindate": {                                                                                         //
          "$date": "2016-11-24T20:40:11.386Z"                                                                        //
          },                                                                                                         //
          "createdAt": {                                                                                             //
          "$date": "2016-11-10T14:49:19.288Z"                                                                        //
          }                                                                                                          //
          }                                                                                                          //
          */                                                                                                         //
                                                                                                                     //
          /**                                                                                                        //
           * Test Joining                                                                                            //
           */                                                                                                        //
                                                                                                                     //
          var joinstatus = {                                                                                         // 1021
            eventjoinernumber: mynumber,                                                                             // 1022
            eventstatus: '11',                                                                                       // 1023
            eventoriginalid: document._id,                                                                           // 1024
            eventtype: 'copy'                                                                                        // 1025
          };                                                                                                         // 1021
          var join_exists = Markers.find(joinstatus, { limit: 1 }).count() > 0;                                      // 1027
                                                                                                                     //
          if (join_exists == true) {                                                                                 // 1029
            var icon = 'https://maps.google.com/mapfiles/kml/pushpin/pink-pushpin.png';                              // 1030
            console.log(" Title " + document.eventtitle + " Number " + mynumber + " Id " + document._id + " Join Exists " + join_exists);
                                                                                                                     //
            if (document.eventownernumber == mynumber) {                                                             // 1033
              var drg = true;                                                                                        // 1034
            } else {                                                                                                 // 1035
              var drg = false;                                                                                       // 1037
            }                                                                                                        // 1038
                                                                                                                     //
            var marker = new google.maps.Marker({                                                                    // 1040
              draggable: drg,                                                                                        // 1041
              animation: google.maps.Animation.DROP,                                                                 // 1042
              position: new google.maps.LatLng(document.lat, document.lng),                                          // 1043
              map: map.instance,                                                                                     // 1044
              icon: icon,                                                                                            // 1045
              id: document._id                                                                                       // 1046
            });                                                                                                      // 1040
          }                                                                                                          // 1048
          if (join_exists == false) {                                                                                // 1049
            var icon = 'https://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png';                              // 1050
            console.log(" Title " + document.eventtitle + " Number " + mynumber + " Id " + document._id + " Join Exists " + join_exists);
                                                                                                                     //
            if (document.eventownernumber == mynumber) {                                                             // 1053
              var drg = true;                                                                                        // 1054
            } else {                                                                                                 // 1055
              var drg = false;                                                                                       // 1057
            }                                                                                                        // 1058
                                                                                                                     //
            var marker = new google.maps.Marker({                                                                    // 1060
              draggable: drg,                                                                                        // 1061
              animation: google.maps.Animation.DROP,                                                                 // 1062
              position: new google.maps.LatLng(document.lat, document.lng),                                          // 1063
              map: map.instance,                                                                                     // 1064
              icon: icon,                                                                                            // 1065
              id: document._id                                                                                       // 1066
            });                                                                                                      // 1060
          }                                                                                                          // 1068
                                                                                                                     //
          //start of drag event                                                                                      //
          google.maps.event.addListener(marker, 'dragend', function (event) {                                        // 1072
                                                                                                                     //
            Markers.update(marker.id, { $set: {                                                                      // 1074
                lat: event.latLng.lat(),                                                                             // 1075
                lng: event.latLng.lng(),                                                                             // 1076
                eventuniqueid: document.eventuniqueid,                                                               // 1077
                eventownernumber: document.eventownernumber,                                                         // 1078
                eventownernames: document.eventownernames,                                                           // 1079
                eventtitle: document.eventtitle,                                                                     // 1080
                eventtime: document.eventtime,                                                                       // 1081
                invited: document.invited,                                                                           // 1082
                eventduration: document.eventduration,                                                               // 1083
                eventtype: document.eventtype,                                                                       // 1084
                eventcategory: document.eventcategory,                                                               // 1085
                //{11:active},{12:expired},{13:marked as deleted}                                                    //
                eventstatus: document.eventstatus,                                                                   // 1087
                eventoriginalid: document.eventoriginalid,                                                           // 1088
                eventjoinernumber: document.eventjoinernumber,                                                       // 1089
                eventjoinernames: document.eventjoinernames,                                                         // 1090
                eventjoindate: document.eventjoindate,                                                               // 1091
                eventleavedate: document.eventleavedate,                                                             // 1092
                createdAt: new Date()                                                                                // 1093
              } });                                                                                                  // 1074
          });                                                                                                        // 1096
          //end of drag event                                                                                        //
          var mid = document._id;                                                                                    // 1098
          var eventtitle = document.eventtitle;                                                                      // 1099
          var eventtime = document.eventtime;                                                                        // 1100
          var eventduration = document.eventduration;                                                                // 1101
          var eventtype = document.eventtype;                                                                        // 1102
          var eventcategory = document.eventcategory;                                                                // 1103
          var js = document.joinstatus;                                                                              // 1104
          var op = document.eventownernumber;                                                                        // 1105
          var theowner = Session.get('telephoneNumber');                                                             // 1106
          var theowner_names = Session.get('names');                                                                 // 1107
                                                                                                                     //
          MyObject = {                                                                                               // 1111
            joinevent: function joinevent(clicked_id) {                                                              // 1112
              console.log(clicked_id);                                                                               // 1113
                                                                                                                     //
              var theid = clicked_id;                                                                                // 1115
              var theownernumber = Session.get('telephoneNumber');                                                   // 1116
              var theowner = Session.get('telephoneNumber');                                                         // 1117
              var theownernames = Session.get('names');                                                              // 1118
              var markerid = Session.get('markerid');                                                                // 1119
              var eowner = Session.get('myeventownernumber');                                                        // 1120
                                                                                                                     //
              var join_upsert_selector = {                                                                           // 1122
                lat: Session.get('mylat'),                                                                           // 1123
                lng: Session.get('mylng'),                                                                           // 1124
                eventuniqueid: Session.get('myeventuniqueid'),                                                       // 1125
                eventownernumber: Session.get('myeventownernumber'),                                                 // 1126
                eventownernames: Session.get('myeventownernames'),                                                   // 1127
                eventtitle: Session.get('myeventtitle'),                                                             // 1128
                eventtime: Session.get('myeventtime'),                                                               // 1129
                invited: Session.get('myinvited'),                                                                   // 1130
                eventduration: Session.get('myeventduration'),                                                       // 1131
                eventtype: 'copy',                                                                                   // 1132
                eventicon: 'https://maps.google.com/mapfiles/kml/pushpin/pink-pushpin.png',                          // 1133
                eventoriginalid: markerid,                                                                           // 1134
                eventcategory: Session.get('myeventcategory'),                                                       // 1135
                eventstatus: Session.get('myeventstatus'),                                                           // 1136
                eventjoinernumber: Session.get('myeventjoinernumber'),                                               // 1137
                eventjoinernames: Session.get('names'),                                                              // 1138
                eventjoindate: new Date(),                                                                           // 1139
                eventleavedate: Session.get('myeventleavedate'),                                                     // 1140
                createdAt: Session.get('mycreatedAt')                                                                // 1141
              };                                                                                                     // 1122
              var xeventtitle = Session.get('myeventtitle');                                                         // 1143
              var notifications_upsert_selector = {                                                                  // 1144
                lat: Session.get('mylat'),                                                                           // 1145
                lng: Session.get('mylng'),                                                                           // 1146
                eventuniqueid: Session.get('myeventuniqueid'),                                                       // 1147
                eventownernumber: Session.get('myeventownernumber'),                                                 // 1148
                eventownernames: Session.get('myeventownernames'),                                                   // 1149
                eventtitle: Session.get('myeventtitle'),                                                             // 1150
                eventtime: Session.get('myeventtime'),                                                               // 1151
                invited: Session.get('myinvited'),                                                                   // 1152
                eventoriginalid: markerid,                                                                           // 1153
                eventduration: Session.get('myeventduration'),                                                       // 1154
                eventtype: 'notification',                                                                           // 1155
                eventcategory: Session.get('myeventcategory'),                                                       // 1156
                eventstatus: Session.get('myeventstatus'),                                                           // 1157
                createdAt: Session.get('mycreatedAt'),                                                               // 1158
                noticedate: new Date(),                                                                              // 1159
                noticenumber: theownernumber,                                                                        // 1160
                noticenames: theownernames,                                                                          // 1161
                noticemessage: theownernames + ' has joined your event ' + xeventtitle,                              // 1162
                noticestatus: '12'                                                                                   // 1163
              };                                                                                                     // 1144
                                                                                                                     //
              Meteor.call('join_upsert', join_upsert_selector, theowner, theid);                                     // 1167
              Meteor.call('notification_upsert', notifications_upsert_selector, markerid);                           // 1168
              $('.leave').show();                                                                                    // 1169
              var icon = 'https://maps.google.com/mapfiles/kml/pushpin/pink-pushpin.png';                            // 1170
              markers[theid].setIcon(icon);                                                                          // 1171
            },                                                                                                       // 1172
            leaveevent: function leaveevent(clicked_id) {                                                            // 1173
              var theid = clicked_id;                                                                                // 1174
              var thenumber = Session.get('telephoneNumber');                                                        // 1175
              console.log("try march ddp", document._id);                                                            // 1176
              console.log("try match", theid);                                                                       // 1177
              // Markers.remove({_id:theid,eventtype:'copy'});                                                       //
              //alert('DDP Leave button toggle setup');                                                              //
              //Meteor.call('leave_event',theid,thenumber);                                                          //
              Meteor.call('leave_event', theid, thenumber, function (error) {                                        // 1181
                if (error) {                                                                                         // 1182
                  console.log(error.reason);                                                                         // 1183
                } else {                                                                                             // 1184
                  console.log('left event successfully');                                                            // 1185
                  $('.join').show();                                                                                 // 1186
                }                                                                                                    // 1187
              });                                                                                                    // 1188
                                                                                                                     //
              var icon = 'https://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png';                            // 1190
              markers[clicked_id].setIcon(icon);                                                                     // 1191
            },                                                                                                       // 1192
            imevent: function imevent(clicked_id) {                                                                  // 1193
              var theid = clicked_id;                                                                                // 1194
              var myApp = new Framework7();                                                                          // 1195
              var $$ = Dom7;                                                                                         // 1196
                                                                                                                     //
              myApp.prompt('Enter your message', 'Send Message To Event Owner', function (value) {                   // 1198
                myApp.alert('Your message was sent successfully!', 'Geo Canada');                                    // 1200
              }, function (value) {                                                                                  // 1201
                myApp.alert('You have canceled sending message.', 'Geo Canada');                                     // 1203
              });                                                                                                    // 1204
            },                                                                                                       // 1206
            editevent: function editevent(clicked_id, niq) {                                                         // 1207
              var theid = clicked_id;                                                                                // 1208
              console.log('from inside edit event', clicked_id);                                                     // 1209
              //alert(niq);                                                                                          //
              $('.popup').remove();                                                                                  // 1211
              var myApp = new Framework7();                                                                          // 1212
              var $$ = Dom7;                                                                                         // 1213
              //myApp.closeModal('.popup');                                                                          //
              var EditApp = new Framework7();                                                                        // 1215
              var edit_eventtitle = Markers.findOne({ _id: theid }).eventtitle;                                      // 1216
              var edit_eventtime = Markers.findOne({ _id: theid }).eventtime;                                        // 1217
              var edit_eventduration = Markers.findOne({ _id: theid }).eventduration;                                // 1218
              var edit_eventcategory = Markers.findOne({ _id: theid }).eventcategory;                                // 1219
              var edit_eventtype = Markers.findOne({ _id: theid }).eventtype;                                        // 1220
              if (edit_eventcategory == 'hackathon') {                                                               // 1221
                var das_optionen = '<option value="hackathon" selected>Hackathon</option><option value="birthday">Birthday</option><option value="barmitzvah">Bar Mitzvah</option>';
              }                                                                                                      // 1223
              if (edit_eventcategory === 'birthday') {                                                               // 1224
                var das_optionen = '<option value="hackathon">Hackathon</option><option value="birthday" selected>Birthday</option><option value="barmitzvah">Bar Mitzvah</option>';
              }                                                                                                      // 1226
              if (edit_eventcategory === 'barmitzvah') {                                                             // 1227
                var das_optionen = '<option value="hackathon">Hackathon</option><option value="birthday">Birthday</option><option value="barmitzvah" selected>Bar Mitzvah</option>';
              }                                                                                                      // 1229
              if (edit_eventtype === 'private') {                                                                    // 1230
                var du_hast = '<option value="private" selected>Private</option><option value="public">Public</option>';
              }                                                                                                      // 1232
              if (edit_eventtype == 'public') {                                                                      // 1233
                var du_hast = '<option value="private">Private</option><option value="public" selected>Public</option>';
              }                                                                                                      // 1235
              var ehtml = '<div class="popup">' + '<div class="row">' + '<div class="col-100">' + '<div class="buttons-row">' + '<a  href="#tab1" class="button active tab-link">Update Event</a>' + '<a  href="#tab2" class="button tab-link">Update Invite List</a>' + '</div>' + '<div class="tabs">' + '<div class="tab active" id="tab1">' + '<fieldset class="ml form-inline">' + '<label class="control-label">Event Title</label><br/>' + '<input type="text" class="form-control input-medium" id="eventtitle" value="' + edit_eventtitle + '" required/><br/>' + '<label class="control-label">Event Time</label><br/>' + '<input type="time" class="form-control input-medium" id="eventtime" value="' + edit_eventtime + '" /><br/>' + '<label class="control-label">Event Duration In Minutes</label><br/>' + '<input type="number"  class="form-control input-medium" id="eventduration" value="' + edit_eventduration + '"  /><br/>' + '<label class="control-label">Event Category</label><br/>' + '<select class="form-control input-medium" id="eventcategory" name="category">' + das_optionen + '</select><br/>' + '<label class="control-label">Event Type</label><br/>' + '<select class="form-control input-medium" id="eventtype">' + du_hast + '</select><br/>' + '<button class="pull-left kancel btn btn-danger close-popup">Close</button>' + '<button class="pull-right ce btn btn-success close-popup">Update Event</button>' + '</fieldset>' + '</div>' + '<div class="tab" id="tab2"><table class="table ml table-striped">' + '<thead>' + '<tr>' + '<th>Names</th>' + '<th>Action</th>' + '</tr>' + '</thead>' + '<tbody>' + '</tbody>' + '</table></div>' + '</div>' + '</div>' + '</div>' + '</div>';
              EditApp.popup(ehtml);                                                                                  // 1279
                                                                                                                     //
              //impose contacts                                                                                      //
                                                                                                                     //
              var editeventtitle = $('#eventtitle').val();                                                           // 1284
              var editeventtime = $('#eventtime').val();                                                             // 1285
              var editeventduration = $('#eventduration').val();                                                     // 1286
              var editeventcategory = $('#eventcategory').val();                                                     // 1287
              var editeventtype = $('#eventtype').val();                                                             // 1288
              var editlat = Markers.findOne({ _id: theid }).lat;                                                     // 1289
              var editlng = Markers.findOne({ _id: theid }).lng;                                                     // 1290
              var editeventuniqueid = Markers.findOne({ _id: theid }).eventuniqueid;                                 // 1291
              var editeventownernumber = Markers.findOne({ _id: theid }).eventownernumber;                           // 1292
              var editeventownernames = Markers.findOne({ _id: theid }).eventownernames;                             // 1293
              var editinvited = Markers.findOne({ _id: theid }).invited;                                             // 1294
              var editeventoriginalid = Markers.findOne({ _id: theid }).eventoriginalid;                             // 1295
              var editeventstatus = Markers.findOne({ _id: theid }).eventstatus;                                     // 1296
              var editeventjoinernumber = Markers.findOne({ _id: theid }).eventjoinernumber;                         // 1297
              var editeventjoinernames = Markers.findOne({ _id: theid }).eventjoinernames;                           // 1298
              var editeventjoindate = Markers.findOne({ _id: theid }).eventjoindate;                                 // 1299
              var editeventleavedate = Markers.findOne({ _id: theid }).eventleavedate;                               // 1300
              var editcreatedAt = Markers.findOne({ _id: theid }).createdAt;                                         // 1301
                                                                                                                     //
              var edit_upsert_selector = {                                                                           // 1303
                lat: editlat,                                                                                        // 1304
                lng: editlng,                                                                                        // 1305
                eventuniqueid: editeventuniqueid,                                                                    // 1306
                eventownernumber: editeventownernumber,                                                              // 1307
                eventownernames: editeventownernames,                                                                // 1308
                eventtitle: editeventtitle,                                                                          // 1309
                eventtime: editeventtime,                                                                            // 1310
                invited: editinvited,                                                                                // 1311
                eventduration: editeventduration,                                                                    // 1312
                eventtype: 'notification',                                                                           // 1313
                eventoriginalid: editeventoriginalid,                                                                // 1314
                eventcategory: editeventcategory,                                                                    // 1315
                eventstatus: editeventstatus,                                                                        // 1316
                eventjoinernumber: editeventjoinernumber,                                                            // 1317
                eventjoinernames: editeventjoinernames,                                                              // 1318
                eventjoindate: editeventjoindate,                                                                    // 1319
                eventleavedate: editeventleavedate,                                                                  // 1320
                createdAt: editcreatedAt                                                                             // 1321
              };                                                                                                     // 1303
              var niq = editeventuniqueid;                                                                           // 1323
              Meteor.call('edit_notification_upsert', edit_upsert_selector, niq);                                    // 1324
            }                                                                                                        // 1326
          };                                                                                                         // 1111
                                                                                                                     //
          //***************************************************Start of Marker event**********************************************
          google.maps.event.addListener(marker, 'click', function () {                                               // 1332
            if (Meteor.isServer) {                                                                                   // 1333
              Meteor.publish('kontacts', function () {                                                               // 1334
                return Kontacts.find();                                                                              // 1335
              });                                                                                                    // 1336
            }                                                                                                        // 1337
                                                                                                                     //
            console.log("Current clicked marker id", document._id, " Title", document.eventtitle);                   // 1340
            var tnumber = Session.get('telephoneNumber');                                                            // 1341
            delete Session.keys['markerid'];                                                                         // 1342
            delete Session.keys['mylat'];                                                                            // 1343
            delete Session.keys['mylng'];                                                                            // 1344
            delete Session.keys['myeventuniqueid'];                                                                  // 1345
            delete Session.keys['myeventownernumber'];                                                               // 1346
            delete Session.keys['myeventownernames'];                                                                // 1347
            delete Session.keys['myeventtitle'];                                                                     // 1348
            delete Session.keys['myeventtime'];                                                                      // 1349
            delete Session.keys['myinvited'];                                                                        // 1350
            delete Session.keys['myeventduration'];                                                                  // 1351
            delete Session.keys['myeventtype'];                                                                      // 1352
            delete Session.keys['myeventcategory'];                                                                  // 1353
            delete Session.keys['myeventstatus'];                                                                    // 1354
            delete Session.keys['myeventjoinernumber'];                                                              // 1355
            delete Session.keys['myeventjoinernames'];                                                               // 1356
            delete Session.keys['mycreatedAt'];                                                                      // 1357
            Session.set('markerid', document._id);                                                                   // 1358
            Session.set('mylat', document.lat);                                                                      // 1359
            Session.set('mylng', document.lng);                                                                      // 1360
            Session.set('myeventuniqueid', document.eventuniqueid);                                                  // 1361
            Session.set('myeventownernumber', document.eventownernumber);                                            // 1362
            Session.set('myeventownernames', document.eventownernames);                                              // 1363
            Session.set('myeventtitle', document.eventtitle);                                                        // 1364
            Session.set('myeventtime', document.eventtime);                                                          // 1365
            Session.set('myinvited', document.invited);                                                              // 1366
            Session.set('myeventduration', document.eventduration);                                                  // 1367
            Session.set('myeventtype', document.eventtype);                                                          // 1368
            Session.set('myeventcategory', document.eventcategory);                                                  // 1369
            Session.set('myeventstatus', document.eventstatus);                                                      // 1370
            Session.set('myeventjoinernumber', tnumber);                                                             // 1371
            Session.set('myeventjoinernames', document.eventjoinernames);                                            // 1372
            Session.set('mycreatedAt', document.createdAt);                                                          // 1373
                                                                                                                     //
            //****************************************************Start of info window code on marker click          //
                                                                                                                     //
            var joinstatus = {                                                                                       // 1377
              eventjoinernumber: theowner,                                                                           // 1378
              eventstatus: '11',                                                                                     // 1379
              eventoriginalid: document._id,                                                                         // 1380
              eventtype: 'copy'                                                                                      // 1381
            };                                                                                                       // 1377
            var j_exists = Markers.find(joinstatus, { limit: 1 }).count() > 0;                                       // 1383
            console.log('join status', j_exists);                                                                    // 1384
                                                                                                                     //
            var eventtitle = Session.get('myeventtitle');                                                            // 1386
            var eventtime = Session.get('myeventtime');                                                              // 1387
            var eventduration = Session.get('myeventduration');                                                      // 1388
            var eventcategory = Session.get('myeventcategory');                                                      // 1389
                                                                                                                     //
            if (j_exists == true) {                                                                                  // 1392
              var kontent = '<button onClick="MyObject.leaveevent(this.id);" id=' + mid + ' class="mr leave btn btn-danger pull-right"><i class="fa fa-times" aria-hidden="true"></i> Leave</button><button onClick="MyObject.joinevent(this.id);" id=' + mid + ' class="mr join btn btn-primary pull-right"><i class="fa fa-plus" aria-hidden="true"></i> Join</button><br/><hr/><span class="gb">Event Title</span> ' + eventtitle + ' <br/><span class="gb">Event Time</span> ' + eventtime + '<br/><span class="gb">Event Duration</span> ' + eventduration + '<br/><span class="gb">Event Category</span> ' + eventcategory + '';
            }                                                                                                        // 1395
            if (j_exists == false) {                                                                                 // 1396
              var kontent = '<button onClick="MyObject.leaveevent(this.id);" id=' + mid + ' class="mr leave btn btn-danger pull-right"><i class="fa fa-times" aria-hidden="true"></i> Leave</button><button onClick="MyObject.joinevent(this.id);" id=' + mid + ' class="mr join btn btn-primary pull-right"><i class="fa fa-plus" aria-hidden="true"></i> Join</button><br/><hr/><span class="gb">Event Title</span> ' + eventtitle + ' <br/><span class="gb">Event Time</span> ' + eventtime + '<br/><span class="gb">Event Duration</span> ' + eventduration + '<br/><span class="gb">Event Category</span> ' + eventcategory + '';
            }                                                                                                        // 1399
            if (op == theowner) {                                                                                    // 1400
              var mid = document._id;                                                                                // 1401
              var niq = document.eventuniqueid;                                                                      // 1402
              var session_marker_id = Session.get('markerid');                                                       // 1403
                                                                                                                     //
              var kontent = '<button onClick="MyObject.editevent(this.id,this.name);" data-del=' + mid + ' name=' + niq + ' class="mr edit btn btn-danger pull-right"><i class="fa fa-remove" aria-hidden="true"></i> Delete</button> <button onClick="MyObject.editevent(this.id,this.name);" id=' + mid + ' name=' + niq + ' class="mr edit btn btn-success pull-right"><i class="fa fa-edit" aria-hidden="true"></i> Edit</button><br/><hr/><span class="gb">Event Title</span> ' + eventtitle + ' <br/><span class="gb">Event Time</span> ' + eventtime + '<br/><span class="gb">Event Duration</span> ' + eventduration + '<br/><span class="gb">Event Category</span> ' + eventcategory + '';
            }                                                                                                        // 1406
                                                                                                                     //
            var infoWindow = new google.maps.InfoWindow({                                                            // 1408
              content: kontent                                                                                       // 1409
            });                                                                                                      // 1408
                                                                                                                     //
            Tracker.autorun(function () {                                                                            // 1412
              var theownerr = Session.get('telephoneNumber');                                                        // 1413
              var joinstatus = {                                                                                     // 1414
                eventjoinernumber: theownerr,                                                                        // 1415
                eventstatus: '11',                                                                                   // 1416
                eventoriginalid: document._id,                                                                       // 1417
                eventtype: 'copy'                                                                                    // 1418
              };                                                                                                     // 1414
              var jj_exists = Markers.find(joinstatus, { limit: 1 }).count() > 0;                                    // 1420
              var tmid = document._id;                                                                               // 1421
              console.log('join status reactive', jj_exists);                                                        // 1422
                                                                                                                     //
              if (jj_exists == true) {                                                                               // 1424
                //alert('true');                                                                                     //
                $('.join').hide();                                                                                   // 1426
                $('.leave').show();                                                                                  // 1427
                //$('#'+tmid).removeClass("join").addClass("leave");                                                 //
              }                                                                                                      // 1429
              if (jj_exists == false) {                                                                              // 1430
                //alert('true');                                                                                     //
                $('.leave').hide();                                                                                  // 1432
                $('.join').show();                                                                                   // 1433
                //$('#'+tmid).removeClass("leave").addClass("join");                                                 //
              }                                                                                                      // 1435
            });                                                                                                      // 1436
                                                                                                                     //
            //****************************************************End of info window code on marker click            //
                                                                                                                     //
            var theApp = new Framework7();                                                                           // 1440
                                                                                                                     //
            var $$ = Dom7;                                                                                           // 1442
                                                                                                                     //
            var mid = document._id;                                                                                  // 1444
            var niq = document.eventuniqueid;                                                                        // 1445
            var session_marker_id = Session.get('markerid');                                                         // 1446
                                                                                                                     //
            /**                                                                                                      //
            var popupHTML = '<div class="popup login-screen">'+                                                      //
                           '<div class="content-block">'+                                                            //
                             ''+kontent+''+                                                                          //
                             '<p><a href="#" class="close-popup">Close me</a></p>'+                                  //
                           '</div>'+                                                                                 //
                         '</div>';                                                                                   //
                         */                                                                                          //
            var popupHTML = '<div class="popup login-screen">' + '<div class="content-block">' + '' + kontent + '' + '<p><a href="#" class="close-popup">Close me</a></p>' + '</div>' + '</div>';
            //bootbox.alert(popupHTML);                                                                              //
            $$('.cp').remove();                                                                                      // 1464
            $$('.popup').remove(popupHTML);                                                                          // 1465
            theApp.popup(popupHTML);                                                                                 // 1466
            //$('<div><div/>').html(popupHTML).dialog();                                                             //
            //vex.dialog.alert({ unsafeMessage:popupHTML});                                                          //
                                                                                                                     //
            Tracker.autorun(function () {                                                                            // 1472
              var theownerr = Session.get('telephoneNumber');                                                        // 1473
              var joinstatus = {                                                                                     // 1474
                eventjoinernumber: theownerr,                                                                        // 1475
                eventstatus: '11',                                                                                   // 1476
                eventoriginalid: document._id,                                                                       // 1477
                eventtype: 'copy'                                                                                    // 1478
              };                                                                                                     // 1474
              var jj_exists = Markers.find(joinstatus, { limit: 1 }).count() > 0;                                    // 1480
              var tmid = document._id;                                                                               // 1481
                                                                                                                     //
              console.log('join status reactive', jj_exists);                                                        // 1485
                                                                                                                     //
              if (jj_exists == true) {                                                                               // 1487
                                                                                                                     //
                //alert('true');                                                                                     //
                $('.join').hide();                                                                                   // 1490
                $('.leave').show();                                                                                  // 1491
                //$('#'+tmid).removeClass("join").addClass("leave");                                                 //
              }                                                                                                      // 1493
              if (jj_exists == false) {                                                                              // 1494
                                                                                                                     //
                //alert('true');                                                                                     //
                $('.leave').hide();                                                                                  // 1497
                $('.join').show();                                                                                   // 1498
                //$('#'+tmid).removeClass("leave").addClass("join");                                                 //
              }                                                                                                      // 1500
            });                                                                                                      // 1501
          });                                                                                                        // 1502
                                                                                                                     //
          //***************************************************End of Marker event**********************************************
                                                                                                                     //
          markers[document._id] = marker;                                                                            // 1506
        },                                                                                                           // 1508
        //**********************************************************************End list markers                     //
        changed: function changed(newDocument, oldDocument) {                                                        // 1510
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });                      // 1511
        },                                                                                                           // 1512
        removed: function removed(oldDocument) {                                                                     // 1513
          markers[oldDocument._id].setMap(null);                                                                     // 1514
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);                                        // 1515
          delete markers[oldDocument._id];                                                                           // 1516
        }                                                                                                            // 1517
      });                                                                                                            // 983
    });                                                                                                              // 1519
  });                                                                                                                // 1520
                                                                                                                     //
  Template.map.onRendered(function () {                                                                              // 1522
                                                                                                                     //
    if (Meteor.isCordova) {                                                                                          // 1524
      navigator.contactsPhoneNumbers.list(function (contacts) {                                                      // 1525
        console.log(contacts.length + ' contacts found');                                                            // 1526
        for (var i = 0; i < contacts.length; i++) {                                                                  // 1527
          for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {                                                // 1528
                                                                                                                     //
            var phone = contacts[i].phoneNumbers[j];                                                                 // 1530
            var currentnumber = Session.get('telephoneNumber');                                                      // 1531
            var currentnames = Session.get('names');                                                                 // 1532
                                                                                                                     //
            var selector = {                                                                                         // 1534
              my_number: currentnumber,                                                                              // 1535
              my_names: currentnames,                                                                                // 1536
              contact_names: contacts[i].displayName,                                                                // 1537
              contact_number: phone.number                                                                           // 1538
            };                                                                                                       // 1534
            var this_exists = Kontacts.find(selector, { limit: 1 }).count() > 0;                                     // 1540
                                                                                                                     //
            if (this_exists == true) {                                                                               // 1542
              console.log('Caught Duplicate');                                                                       // 1543
            } else {                                                                                                 // 1544
              Kontacts.insert({                                                                                      // 1545
                my_number: currentnumber,                                                                            // 1546
                my_names: currentnames,                                                                              // 1547
                contact_names: contacts[i].displayName,                                                              // 1548
                contact_number: phone.number,                                                                        // 1549
                created: new Date()                                                                                  // 1550
              });                                                                                                    // 1545
            }                                                                                                        // 1552
          }                                                                                                          // 1554
        }                                                                                                            // 1555
      });                                                                                                            // 1557
    }                                                                                                                // 1559
    GoogleMaps.ready('map', function (map) {                                                                         // 1560
      var latLng = Geolocation.latLng();                                                                             // 1561
      var latt = latLng.lat;                                                                                         // 1562
      var lngg = latLng.lng;                                                                                         // 1563
                                                                                                                     //
      var marker = new google.maps.Marker({                                                                          // 1565
        position: new google.maps.LatLng(latt, lngg),                                                                // 1566
        map: map.instance,                                                                                           // 1567
        icon: 'https://maps.google.com/mapfiles/kml/shapes/ranger_station.png',                                      // 1568
        center: new google.maps.LatLng(latt, lngg),                                                                  // 1569
        zoom: 16                                                                                                     // 1570
      });                                                                                                            // 1565
    });                                                                                                              // 1572
  });                                                                                                                // 1573
                                                                                                                     //
  Template.map.helpers({                                                                                             // 1576
    mapOptions: function mapOptions() {                                                                              // 1577
      if (GoogleMaps.loaded()) {                                                                                     // 1578
        var latLng = Geolocation.latLng();                                                                           // 1579
        var latt = latLng.lat;                                                                                       // 1580
        var lngg = latLng.lng;                                                                                       // 1581
        return {                                                                                                     // 1582
          center: new google.maps.LatLng(latt, lngg),                                                                // 1583
          zoom: 16,                                                                                                  // 1584
          icon: 'https://maps.google.com/mapfiles/kml/shapes/ranger_station.png',                                    // 1585
          zoomControl: true,                                                                                         // 1586
          zoomControlOptions: {                                                                                      // 1587
            position: google.maps.ControlPosition.TOP_RIGHT                                                          // 1588
          }                                                                                                          // 1587
        };                                                                                                           // 1582
      }                                                                                                              // 1591
    }                                                                                                                // 1592
  });                                                                                                                // 1576
}                                                                                                                    // 1594
                                                                                                                     //
//**************************************************************************End of client                            //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},{"extensions":[".js",".json"]});
require("./index.js");
//# sourceMappingURL=app.js.map
