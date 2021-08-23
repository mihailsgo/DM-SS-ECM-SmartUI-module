/*
 version: 1.09.
 changes: 
  - introducing action_type param

 for initialization run with env. settings
 DMSS.setup({
    docid:            document id for sining,
    certificateType:  SHA-1,
    urlPrefix:        [LL_REPTAG_URLPREFIX /],
    restClientID:     WR ID for rest calls
 });
*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else if (typeof csui === 'object' ){
    // CSSmartUI
    csui.require(['csui/lib/jquery'], factory);
  } else {
    // Browser globals (Note: root is window)
    root.DMSS = factory(root.jQuery);
  }
}(this, function (jQuery) {
  jQuery.dm = jQuery.dm || {};

  jQuery.dm.eventable = function (obj) {
      // Allow use of Function.prototype for shorthanding the augmentation of classes
      obj = jQuery.isFunction(obj) ? obj.prototype : obj;
      // Augment the object (or prototype) with eventable methods
      return jQuery.extend(obj, jQuery.dm.eventable.prototype);
    };

  jQuery.dm.eventable.prototype = {
    // The trigger event must be augmented separately because it requires a
    // new Event to prevent unexpected triggering of a method (and possibly
    // infinite recursion) when the event type matches the method name
    trigger: function (type, data) {
      var event = new jQuery.Event(type); 
      event.preventDefault();                
      jQuery.event.trigger(event, data, this);
      return this;
    }
  };

  // Augment the object with jQuery's event methods
  jQuery.each(['bind', 'one', 'unbind', 'on', 'off'], function (i, method) {
    jQuery.dm.eventable.prototype[method] = function (type, data, fn) {
      jQuery(this)[method](type, data, fn);
      return this;
    };
  });
}));

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else if (typeof csui === 'object' ){
    // CSSmartUI
    csui.require(['csui/lib/jquery'], factory);
  } else {
    // Browser globals (Note: root is window)
    root.DMSS = factory(root.jQuery, root.hwcrypto, root.eparakstshwcrypto);
  }
}(this, function ($, hwcrypto, eparakstshwcrypto) {
  'use strict';
  
  var scope = {
    signatures: signatures,
    sign:       sign,
    setup:      setup,
    create:     create  
  };
  var module = $.dm.eventable(scope);
  var options = {
    docid:            '',
    certificateType:  'SHA-1',
    urlPrefix:        '',
    restClientID:     '',
    timeout:          300
  };
  var wrParams = {
    func:       'll',
    objAction:  'RunReport',
    objId:      options.restClientID
  };
  var busy = false;
  var timeoutStart;

  function takeSlot() {
    var result = !busy;
    if (result) {
      busy = true;
      scope.trigger('status',['busy']);
    }
    return result;
  }

  function freeSlot(){
    busy = false;
    scope.trigger('status',['avaliable']);
  }

  function setup (o) {
    $.extend(options,o || {});
    wrParams.objId = options.restClientID;

    return options;
  }

  function packError (name, data){
    var error = { name: name };

    if (typeof data === 'object') {
      $.extend(error, data);
    } else {
      error.data = data || '';
    }

    return error;
  }

  function signatures(){
    var jqXHR;

    if (!takeSlot()) {
      return false;
    }

    scope.trigger('notify',['info','PREPARING_DATA']);

    jqXHR = $.ajax(options.urlPrefix, {
      method: "GET",
      cache: false,
      data: $.extend({ 
        nodeid: options.docid,
        action: 'info'
      },wrParams),
      dataFilter: function normalize (data,status,jqXHR) {
        var result, isPdf;

        try {
          result = JSON.parse(data);
        } catch (error) {
          return JSON.stringify({error:'UNSUPPORTED FORMAT'});
        }

        if (!result) {
          return JSON.stringify({error:'UNSUPPORTED FORMAT'})
        }

        isPdf = result.filetype == 'pdf';

        $.each(result.signatures,function(i,v){
          var signTime = new Date(v.claimedSigningTime.split('+')[0] + 'Z');
          var formatted = signTime.toJSON().substr(0,10).split('-').reverse().join('.');
          var hours_minutes = ('0' + signTime.getHours()).slice(-2) + ':' + ('0' + signTime.getMinutes()).slice(-2);
          var givenName = v.givenName;

          if (isPdf) {
            v.givenName = givenName.split(',')[1];
            v.lastName =  givenName.split(',')[0];
            v.idCode =    (givenName.split(',')[2] || '').split(' ')[0];
          }

          v.formatted = v.givenName + ' ' + v.lastName + ' (' + v.idCode + ') ' + formatted + ' ' + hours_minutes;
        });

        return JSON.stringify(result);
      }
    })
    .always(freeSlot)
    .done(function(data){
      if (data.error) {
        scope.trigger('notify',['error',data.error]);
      } else {
        scope.trigger('signatures',[data]);
      }
    })
    .fail(function(error){
      scope.trigger('notify',['error','UNSUPPORTED FORMAT']);
    });

    return true;
  }

  function create (p){
    var promise;
    var params = $.extend({
      country:  '',
      docs:     '',
      mode:     'version',
      action_type: 'version',
      method:   'smart',
      pcode:    '',
      mobile:   '',
      cats:     '',
      target:   '',
      createandsign: '',
      name:     ''
    },p);
	
    //check on mandatory params
    if (!params.name || !params.target || !(!!params.country || params.createandsign == 'false')) {
      return false;
    }

    if (!takeSlot()) {
      return false;
    }

	//workaround UTF-8 escaping, because some of service parts don't handle it well
	params.name = encodeURIComponent(params.name);

    scope.trigger('notify',['info','CREATION_STARTED']);

    promise = createMobile(params);

    return $.when(promise)
    .fail(function(error){
      scope.trigger('notify',['error',error.name]);
    })
    .done(function(data){
      scope.trigger('notify',['info',data]);
    })
    .always(freeSlot);
  }

  function sign (p) {
    var params = $.extend({
      country:  '',
      method:   'smart',
      pcode:    '',
      mobile:   '',
      target:   options.docid
    },p);

    var promise;

    if (!takeSlot()) {
      return false;
    }

    scope.trigger('notify',['info','SIGNING_STARTED']);

    switch (params.method) {
      case 'eid':
        promise = signEid(params.country, params.target);
        break;
      case 'mobile':
      case 'smart':
        promise = signMobile(params.country, params.pcode, params.mobile, params.target, params.method);
        break;
      default:
        promise = $.Deferred().reject(packError('SIGNING_METHOD_UNKNOWN'));
    }

    return $.when(promise)
    .fail(function(error){
      scope.trigger('notify',['error',error.name]);
    })
    .done(function(data){
      scope.trigger('notify',['info',data]);
      //signatures();
    })
    .always(freeSlot);

  }

  function mobileCheck (session, type, doc){
    var promise = $.Deferred();

    if (timeoutStart.getTime() + (options.timeout * 1000) < new Date().getTime()) {
      promise.reject(packError('SIGNING_TIMEOUT'));
      return promise;
    }

    $.ajax(options.urlPrefix,{
      type:     "GET",
      cache:    false,
      dataType: 'json',
      data:     $.extend({ 
        session:    session,
        type:       type,
        id:         doc,
        action:     'status'
      },wrParams)
    })
    .done(function(data){
      if (data.result == 'SIGNING_IN_PROGRESS'){
        setTimeout(function(){
          $.when(mobileCheck(session, type, doc))
          .fail(function(error){
            promise.reject(packError('SIGNING_ERROR',error));
          })
          .done(function(){
            promise.resolve('SIGNING_COMPLETED');
          });
        }, 300);
      } else if (data.result == 'SIGNING_COMPLETED'){
        promise.resolve('SIGNING_COMPLETED');
      } else {
        promise.reject(packError('SIGNING_ERROR'));
      }
    })
    .fail(function(error){
      promise.reject(packError('SIGNING_ERROR',error));
    });
     
    return promise;
  }

  function createMobile (params) {
    var promise = $.Deferred();
    var country = params.country;
    var code = params.pcode;

    if ((country.toLowerCase() == 'lv') && (code.length == 11) ){
      code = code.substr(0, 6) + '-' + code.substr(6, 11);
    }

    $.post(options.urlPrefix, $.extend({ 
      action:     'create',
      mode:       params.mode,
      action_type:params.action_type,
      signtype:   params.method,
      pcode:      code, 
      mobile:     params.mobile,
      cats:       params.cats,
      options:    params.target,
      createandsign: params.createandsign,
      name:       params.name,
      documents:  params.docs,
      lng:        country
    },wrParams))
    .done(function(data){
      if (params.createandsign == 'false' && !!data.containerID) {
        scope.trigger('created',{'containerId': data.containerID });
        promise.resolve('CREATION_COMPLETED');
      } else if (params.createandsign == 'false' && !data.containerID) {
        promise.reject(packError('CREATION_ERROR'));
      } else if (data.sessionCode != undefined) {
        scope.trigger('notify',['info','VERIFICATION_CODE',data.verificationCode]);
        timeoutStart = new Date();
        $.when(mobileCheck(data.sessionCode, params.method, params.target))
        .done(function(){
          promise.resolve('SIGNING_COMPLETED');
        })
        .fail(function(error){
          promise.reject(packError('CREATION_ERROR',error));
        });
      } else {
        promise.reject(packError('CREATION_ERROR'));
      }
    })
    .fail(function(error){
      promise.reject(packError('CREATION_ERROR',error));
    });

    return promise;
  }

  function signMobile (country, code, phone, doc, type) {

    var promise = $.Deferred();

    if ((country.toLowerCase() == 'lv') && (code.length == 11) ){
      code = code.substr(0, 6) + '-' + code.substr(6, 11);
    }

    $.ajax(options.urlPrefix,{
      type:     "GET",
      cache:    false,
      dataType: 'json',
      data:     $.extend({ 
        country:    country,
        code:       code,
        phone:      phone,
        nodeid:     doc,
        type:       type,
        action:     'sign'
      },wrParams)
    })
    .done(function(data){
      if (data.sessionCode != undefined) {
        scope.trigger('notify',['info','VERIFICATION_CODE',data.verificationCode]);
        timeoutStart = new Date();
        $.when(mobileCheck(data.sessionCode, type, doc))
        .done(function(){
          promise.resolve('SIGNING_COMPLETED');
        })
        .fail(function(error){
          promise.reject(packError('SIGNING_ERROR',error));
        });
      } else {
        promise.reject(packError('SIGNING_ERROR'));
      }
    })
    .fail(function(error){
      promise.reject(packError('SIGNING_ERROR',error));
    });

    return promise;
  }

  function signEid(lng, contID) {
    function generateHash(id, certHex) {
      return $.post(options.urlPrefix, $.extend({ 
        id: id,
        action: "hash",
        certInHex: certHex
      },wrParams));
    }

    function finishSign (doc, signature) {
      var promise = $.Deferred();

      scope.trigger('notify',['info','PIN_OK']);

      $.post(options.urlPrefix, $.extend({ 
        id: doc,
        signatureInHex: signature,
        action: "signEID"
      },wrParams))
      .done(function(data) {
        if (data.result == 'SIGNING_COMPLETED') {
          promise.resolve('SIGNING_COMPLETED');
        }  else {
          promise.reject(packError('SIGNING_ERROR'));
        }
      })
      .fail(function(error){
        promise.reject(packError('SIGNING_ERROR',error));
      });

      return promise;
    }

    var cert;
    var promise = $.Deferred();
    var promise2;

    try {
      if (lng == 'LV') {
        promise2 = eparakstshwcrypto.getCertificate({ lang: 'en' });
      } else {
        promise2 = hwcrypto.getCertificate({ lang: 'en' });
      }
      
      promise2 = promise2
      .then(function (certificate) {
        cert = certificate;
        return generateHash(contID, cert.hex);
      })
      .then(function (data) { 
        var promise3 = $.Deferred();
        
        if (lng == 'LV') {
          eparakstshwcrypto.sign(cert, { type: options.certificateType, hex: data.hex }, { lang: 'en' })
          .then(function (signature) { promise3.resolve(signature.hex); }, function(error) { promise3.reject(packError('SIGNING_CANCELLED_BY_USER',error)); });
        } else {
          hwcrypto.sign(cert, { type: options.certificateType, hex: data.hex }, { lang: 'en' })
          .then(function (signature) { promise3.resolve(signature.hex); }, function(error) { promise3.reject(packError('SIGNING_CANCELLED_BY_USER',error)); });
        }

        return promise3;
      })
      .then(function (signature) { return finishSign (contID, signature); })
      .then(function(){ promise.resolve('SIGNING_COMPLETED'); }, function(error){ promise.reject(packError('SIGNING_ERROR',error)); });

    } catch (error) { promise.reject(packError('SIGNING_ERROR',error)); }

    return promise;
  }

  if (window.csui) {//adjust globals if in CSSmartUI env.
    window.DMSS =       module;
    hwcrypto =          window.hwcrypto;
    eparakstshwcrypto = window.eparakstshwcrypto;
  }

  return module;
}));