const request = require('request');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');
const fs = require('fs');
const baseSevice2 = 'http://demo.digitalmind.lv:8092/api/'; 
const epmConService = 'http://localhost:8072/api/';
var moment = require('moment');
var activeEPMRequests = [];
var ePM_ticket_assistant = '';

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(express.urlencoded());
app.use(express.json());
app.use(bodyParser.json());

app.post('/hash', function(req, res) {
  
       //console.info(req.body);
       //console.info(req);
       
       //console.info('FILE TYPE = ' + req.query.filetype);
      
            
			console.info(req.query);
			
			let goodJSON = req.query;
			
			/*
			  for (var key in req.query){
				//var value = obj[key];
				//document.write("<br> - " + key + ": " + value);
				
				 goodJSON[key.split('=')[0]] = key.split('=')[1].trim();
				
			  }			
			 */ 
			
			console.info(goodJSON);
			
			 var filetype = goodJSON.filetype;
			
			//let jsonInput = JSON.parse(req.query);
			//console.info(jsonInput);
	  	   
		   var postJSON = {
					certInHex: goodJSON.certInHex,
					signatureProfile: 'LT',
					id: goodJSON.id
		   }
		   
		   //console.info('ticket = ' + req.query.ticket);

       console.info('hash function start');
       console.info(postJSON);
       
		   var url = baseSevice2 + 'signing/ic/container/' + postJSON.id +'/generateHash?certInHex=' + postJSON.certInHex + '&signatureProfile=LT';
		    if (filetype == 'pdf') {
          url = baseSevice2 + 'signing/ic/pdf/' + postJSON.id +'/generateHash?certInHex=' + postJSON.certInHex + '&signatureProfile=LT';
        }
         let ticket = goodJSON.ticket;

      console.info(url);        
      
			request.post({
				url: url,
				method: 'POST',
				headers:{
					'otcsticket': unescape(ticket)
				},        
				json: postJSON
			}, function(error, response, body) {
         
         console.info('-------------------');
         console.info(body);
         console.info('-------------------');
         
				 res.send(error || body);
			})
})

app.post('/signEID', function(req, res) {
		   console.info('signEID function start ' + moment().format('MMMM Do YYYY, hh:mm:ss a'));
       console.info('FILE TYPE = ' + req.query.filetype);
       
		   var signHex = '';
		   var docid = '';
   

       /*
		   try {
				Object.keys(req.query).forEach(function(key, i) {
					console.info('---------');
					if (i == 0)
						docid = key.split('=')[1];
					else 
						signHex = key.split('=')[1];
				});				
				
				console.info(docid);
				console.info(signHex);

		   } catch(e){
				console.info(e);
		   }
      */
	  
	  		let goodJSON = req.query;
			
			/*
			  for (var key in req.query){
				//var value = obj[key];
				//document.write("<br> - " + key + ": " + value);
				
				 goodJSON[key.split('=')[0]] = key.split('=')[1].trim();
				
			  
			  }	
			 */
      
			var filetype = goodJSON.filetype;
	  
		   var postJSON = {
					sessionCode: goodJSON.sessionCode,
					signatureInHex: goodJSON.signatureInHex
			}
      
      //console.info(req.query.id);
      //console.info(sessionCode);
      //console.info(signatureInHex);
      
      
      var url = baseSevice2 + 'signing/ic/container/' + postJSON.sessionCode + '/sign?signatureInHex=' + postJSON.signatureInHex;
	
	  
       //console.info(goodJSON);	  

	  console.info('filetype = ' + filetype);	
	
      if (filetype == 'pdf')
        url = baseSevice2 + 'signing/ic/pdf/' + postJSON.sessionCode + '/sign?signatureInHex=' + postJSON.signatureInHex;
       
	   let ticket = goodJSON.ticket;
	   
	  console.info('signEID function start ' + moment().format('MMMM Do YYYY, hh:mm:ss a'));
      console.info(url);
      
      request.post({
				url: url,
				method: 'POST',
				headers:{
					'otcsticket': unescape(ticket)	
				}	        
			}, function(error, response, body) {
			
				console.info('ID card signing post response');
				console.info(error);
				console.info(body);
				
				if (body.result == 'SIGNING_COMPLETED') {
					res.send(body)
				}		
				 else
					res.send(error || body);
			})
})	

app.get('/createcontainer', function(req, res){
	
	console.info(moment().format('MMMM Do YYYY, h:mm:ss a'));
	
	var docs = [];
	var mode = '';
	var cat = '';
	var options = '';
	var name = '';
	var pcode = '';
	var lng = '';
	var type = 'smart';
	var mobile = '';
	var createandsign = '';
	var ticket = '';

	try {
		docs = req.query.documents;
		mode = req.query.mode;
		cat = req.query.cats;
		options = req.query.options;
		name = req.query.name == undefined ? moment().format('hh.mm.ss') : req.query.name;
		pcode = req.query.pcode;
		lng = req.query.lng;
		type = req.query.signtype;
		mobile = req.query.mobile;
		ticket = req.query.ticket;
	} catch(e){
		console.info('error decoding parameters');
		console.info(e);
	}

	try {
		createandsign = req.query.createandsign;
	} catch(e){
		console.info(e);
	}
	
	var parsedocs = docs.split(',').map(id => {
		return {"documentId": parseInt(id)};
	})	
	
	console.info(parsedocs);
	
	console.info('docs = ' + docs);
	console.info('mode = ' + mode);	
	console.info('cat = ' + cat);
	console.info('options = ' + options);						
	console.info('name = ' + name);							
	console.info('pcode = ' + pcode);		
	console.info('lng = ' + lng);
	console.info('type = ' + type);
	console.info('mobile = ' + mobile);
	console.info('createandsign = ' + createandsign);
	
	var conName = '';
	
	if ((name.toLowerCase().indexOf('.asice')) == -1)
		name = name + ".asice";
		
	
	var jsonData = 	
					{
						"containerDocuments":  parsedocs, 
						"documentId": parseInt(options),
						"newDocumentName": name
					}		

    console.info('DATA TO SEND');
	console.info(jsonData);
	console.info(baseSevice2 + 'container/compose/existing');
	console.info('otcsticket = ' + ticket);
	console.info('END DATA');
		
	request({  
		url: baseSevice2 + 'container/compose/existing',
		headers:{
			'otcsticket': ticket	
		},		
		method: 'POST',
		json: jsonData
	}, function(errorCreate, responseCreate, bodyCreate) {
		
		var conID = '';
		
		console.info(errorCreate);
		console.info(bodyCreate);

		if (!errorCreate && responseCreate.statusCode == 200) {
			if (createandsign == 'true')
				{
						console.info('create and sign scenario');
						console.info('sign function was called: ' + moment().format('MMMM Do YYYY, h:mm:ss a'));
						
						conID =  bodyCreate.containerId;
						
						var jsonToSend = {
								country: lng,
								idCode: pcode,
								phoneNo: mobile
						}
						
						console.info(baseSevice2 + 'signing/' + type + '/container/' + conID + '/sign?id=' + conID);
						console.info(jsonToSend);

						setTimeout(function(){
								request({
									url: baseSevice2 + 'signing/' + type + '/container/' + conID + '/sign?id=' + conID,
									headers:{
										'otcsticket': ticket	
									},									
									method: 'PUT',
									json: jsonToSend
								}, function(error, response, body) {
									console.log(body);
									if (!error && response.statusCode == 200) {
										if (body.sessionCode != undefined) {
											let resp = body;
											resp.containerID = conID;
											res.send(resp);
										} else {
											res.send(body);
										}
									} else {
										res.send(error);
									}
								})						
							
						}, 1500);
				} else {
					console.info('create without signing scenario');
					let resp = bodyCreate;
					resp.containerID = conID;
					res.send(resp);					
				}
		} else {
			res.send({message:errorCreate});
		}
	})					
});

/*
app.get('/createcontainer', function(req, res){
	
	console.info(moment().format('MMMM Do YYYY, hh:mm:ss a'));
	
	var docs = [];
	var mode = '';
	var cat = '';
	var options = '';
	var name = '';
	var pcode = '';
	var lng = '';
	var type = 'smart';
	var mobile = '';

	try {
		docs = req.query.documents;
		mode = req.query.mode;
		cat = req.query.cats;
		options = req.query.options;
		name = req.query.name;
		pcode = req.query.pcode;
		lng = req.query.lng;
		type = req.query.signtype;
		mobile = req.query.mobile;
	} catch(e){
		console.info('error decoding parameters');
		console.info(e);
	}

	var parsedocs = docs.split(',').map(id => {
		return {"documentId": parseInt(id)};
	})	
	
	console.info(parsedocs);
	
	console.info('docs = ' + docs);
	console.info('mode = ' + mode);	
	console.info('cat = ' + cat);
	console.info('options = ' + options);						
	console.info('name = ' + name);							
	console.info('pcode = ' + pcode);		
	console.info('lng = ' + lng);
	console.info('type = ' + type);
	console.info('mobile = ' + mobile);
	
	var conName = '';
	
	if ((name.toLowerCase().indexOf('.asice')) == -1)
		name = name + ".asice";
		
	
	var jsonData = 	
					{
						"containerDocuments":  parsedocs, 
						"documentId": parseInt(options),
						"newDocumentName": name
					}		

	console.info(jsonData);
		
	request({  
		url: baseSevice2 + '/container/compose/existing',
		method: 'POST',
		json: jsonData
	}, function(errorCreate, responseCreate, bodyCreate) {
		
		var conID = '';
		
		console.info(errorCreate);
		console.info(bodyCreate);
		
		if (!errorCreate && responseCreate.statusCode == 200) {
				console.info('sign function was called: ' + moment().format('MMMM Do YYYY, hh:mm:ss a'));
				
				conID =  bodyCreate.containerId;
				
				var jsonToSend = {
						country: lng,
						idCode: pcode,
						phoneNo: mobile
				}
				
				console.info(baseSevice2 + 'signing/' + type + '/container/' + conID + '/sign?id=' + conID);
				console.info(jsonToSend);

				setTimeout(function(){
						request({
							url: baseSevice2 + 'signing/' + type + '/container/' + conID + '/sign?id=' + conID,
							method: 'PUT',
							json: jsonToSend
						}, function(error, response, body) {
							console.log(body);
							if (!error && response.statusCode == 200) {
								if (body.sessionCode != undefined) {
									var resp = body;
									resp.containerID = conID;
									res.send(resp);
								} else {
									res.send(body);
								}
							} else {
								res.send(error);
							}
						})						
					
				}, 1500);
		} else {
			res.send({message:errorCreate});
		}
	})					
});
*/

app.get('/download', function(req, res){
	
	console.info('download function was called');
	var ticket = req.query.otcsticket;
	
	var reqPostFix = '';
	if (req.query.seq)
	{
		reqPostFix = '/file/' + req.query.seq;
	}
	
	console.info('download ticket = ' + ticket);
	console.info(baseSevice2 + 'container/' + req.query.doc + '/download' + reqPostFix);
	
	req.pipe(
		request({
			url:baseSevice2 + 'container/' + req.query.doc + '/download' + reqPostFix,
			headers:{
					'otcsticket': ticket	
				}			
		})).pipe(res);
});

app.get('/status', function(req, res) {
	
	console.info('status function was called ' + moment().format("DD.MM.YYYY hh:mm:ss"));
	var ticket = req.query.ticket;;	
    var service = baseSevice2;
	var scope = 'signing';

    request({
			url:service + scope + '/' + req.query.type + '/session/' + req.query.session + '/status',
			headers:{
				'otcsticket': ticket	
			},			
		},
		function(error, response, body) {
			console.info('Status request body = ' + body);
			
			if (!error && response.statusCode == 200) {
					 res.send(JSON.parse(body))
			} else {
				console.info(error);
				res.send({message:error});			
			} 
      })
})


// /api/signing/smart/pdf/{id}/sign


app.get('/signmobile', function(req, res) {
	console.info('sign function was called ' + moment().format("DD.MM.YYYY hh:mm:ss"));

	var fName = "";
	var ticket = "";
	var requestApi = baseSevice2 + 'signing/' + req.query.type + '/container/' + req.query.id + '/sign?id=' + req.query.id;
	
	try {
		ticket = req.query.ticket;
		fName = req.query.name;
	}
	 catch(e){
		console.info('getcontent function has error parsing name parameter');
	 }
	 
	 console.info('File name is = ' + fName);
	 
	if ((fName.split('.')[fName.split('.').length - 1]).toLowerCase() == 'pdf'){
		requestApi = baseSevice2 + 'signing/' + req.query.type + '/pdf/' + req.query.id + '/sign?id=' + req.query.id;
	}	 		
		
    console.info(ticket);
    
		request({
			url: requestApi,
			headers:{
				'otcsticket': ticket	
			},					
			method: 'PUT',
			json: {
				country: req.query.country,
				idCode: req.query.code,
				phoneNo: req.query.phone
			}
		}, function(error, response, body) {
			
			console.log(body);
			
			if (!error && response.statusCode == 200) {
				if (response.sessionCode != undefined) {
					res.send(JSON.parse(body));
				} else {
					res.send(body);
				}
			} else {
				res.send(error);
			}
		})
})

app.get('/test', function(req, res) {
	console.info('test function was called ' + moment().format("DD.MM.YYYY hh:mm:ss"));
	res.send({result:"OK"});
})

//EPM START

//ask EPM signing status
app.get('/signingEPMStatus', function(req, res){
	let sessionid = req.query.session;
	let sessionStatus = '';
	let url = '';
	let urlsend = '';
	let timeStarted = '';
	
	console.info('signing  EPM status reached');
	
	try {
		sessionStatus = activeEPMRequests.filter(function(item){
			return (item.session == sessionid)
		})[0].status;
		
		url = activeEPMRequests.filter(function(item){
			return (item.session == sessionid)
		})[0].url;
		
		urlsend = activeEPMRequests.filter(function(item){
			return (item.session == sessionid)
		})[0].urlsend;
		
		timeStarted = activeEPMRequests.filter(function(item){
			return (item.session == sessionid)
		})[0].creationTime;		
		
	} catch(e){
		console.info(e);
		res.send({status:'SIGNING_ERROR'});
	}
	
	console.info('sessionStatus = ' + sessionStatus);
	
	if (sessionStatus){
		
		//if status is good then send url
		//if req takes longer than 60 secs
		if (moment().unix() - timeStarted > 60) {
			res.send({status:'SIGNING_ERROR'});	
		} else 
		if (sessionStatus == 'IDENTITY_APPROVED'){
			
			//PIN-2 URL SENDING CRITERIA
			if ((url) && (!urlsend)){
				activeEPMRequests.filter(function(item){
					return (item.session == sessionid)
				})[0].urlsend = true;				

				res.send({
					status:sessionStatus,
					url: url
				});				
			}
			
			else 
			{
				res.send({
							status:sessionStatus,
							url: ''
						});
			}
		} else {
			
			res.send({
						status:sessionStatus,
						url: ''
					});
		}
	}
})

//identify user, get redirect to PM and enter PIN-2
app.get('/signingIdentityEPM', function(req, res){
	console.info('Signing Identity is reached');

	//console.info('ticket = ' + ePM_ticket_assistant);	
	
	let sessionFound = false;
	let postJSON = {
		state: req.query.state,
		code: req.query.code
	}

	//console.info('state = ' + postJSON.state);
	//console.info('code = ' + postJSON.code);
	
	let currentSession  = {};
	
	try {
		currentSession = activeEPMRequests.filter(function(item){
			return (item.session == postJSON.state)
		})[0];	
		sessionFound = true;
	} catch(e){
		console.info(e);
		console.info('');
		res.send({status:'ERROR'})
	}
	
	//valid session
	
	if (sessionFound){
		
		//coming after PIN-2
		if (currentSession.status == 'IDENTITY_APPROVED')
		{
			
				console.info('AFTER PIN-2');
			
				currentSession.status = 'SIGNING_FINSALISATION';
				let requestApi = epmConService + 'signing/lvrtc/signature';

				console.info(requestApi);
				
				request({
					headers:{
						'otcsticket': ePM_ticket_assistant
					},					
					url: requestApi,
					method: 'POST',
					json: true,
					form: { state: postJSON.state, code: postJSON.code },
				}, function(error, response, body) {
					
					console.info(body);
					console.info('new status = ' + body.result);
					
					currentSession.status = body.result;

					res.send('<script>window.top.close();</script>');					
				})				
			
		} else {
			
			console.info('AFTER AUTH');
			
			currentSession.status = 'IDENTITY_APPROVED';
			let requestApi = epmConService + 'signing/lvrtc/signing-identity';
			
			console.info(requestApi);
			
			request({
				headers:{
					'otcsticket': ePM_ticket_assistant	
				},				
				url: requestApi,
				method: 'POST',
				form: { state: postJSON.state, code: postJSON.code },
			}, function(error, response, body) {
				console.info(body);
				console.info(error);
				
				currentSession.url = response.headers.location;
				
				res.send('<script>window.top.close();</script>');
			})				
		}	
	}
})

//return location to enter ePM user number
app.get('/initEPMSign', function(req, res){
	//we should have document type here - PDF or Container
	
	console.info('initEPMSign is called');
	
	let filetype = req.query.filetype; //pdf or container
	
	if (filetype != 'pdf'){
		filetype = 'container';
	}
	
	let docid = req.query.docid;
	let requestApi = epmConService + 'signing/lvrtc/' + filetype + '/' + docid + '/sign';

	ePM_ticket_assistant = req.query.ticket;
	
	console.info('ticket = ' + req.query.ticket);
	console.info(requestApi);
	
	request({
		headers:{
			'otcsticket': req.query.ticket	
		},
		url: requestApi,
		method: 'POST',
		json: true
	}, function(error, response, body) {
		if (!error)
		{
			let sessionID = body.sessionId;
			
			//console.info(response.headers.location);
			
			let newRequest = {
				session: sessionID,
				location: response.headers.location,
				creationTime: moment().unix(),
				documentid: docid,
				fileType: filetype,
				status: 'SIGNING_STARTED',
				url: '',
				urlsend: false
			}
			
			activeEPMRequests.push(newRequest);
			
			//console.info(activeEPMRequests);
			
			res.send({
						sessionID:body.sessionId,
						location:response.headers.location
					 });
		} else {
			res.send({status:'ERROR'})
		}
	})
})

//EPM END












app.get('/getcontent', function(req, res) {
	console.info('content function was called ' + moment().format("DD.MM.YYYY hh:mm:ss"));

	var fName = "";
	var ticket = '';
	var requestApi = baseSevice2 + 'container/' + req.query.id + '/info';
	var type = req.query.type;
	
	try {
		ticket = req.query.ticket;
		fName = req.query.name;
	}
	 catch(e){
		console.info('getcontent function has error parsing name parameter');
	 }
	 
	 console.info('File name is = ' + fName);
	 console.info('Ticket = ' + ticket);
	 
	 console.info(type);
	 
	if (type == 'pdf'){
		requestApi = baseSevice2 + 'pdf/' + req.query.id + '/info';
	}	 
	
	console.info(requestApi);
	
	request({
		headers:{
			'otcsticket': ticket	
		},
		url: requestApi,
		method: 'GET'
	}, function(error, response, body) {
	
		console.info(body);
	
		if (!error && response.statusCode == 200) {
			if (response.sessionCode != undefined) {
				res.send(JSON.parse(body));
			} else {
				res.send(body);
			}
		} else {
			res.send(error);
		}
	})
})

app.listen(97);
