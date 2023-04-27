## Scenario Nr. 1: Deliver latest DM SS SmartUI module to new client
  1. Install microservices - container / archive / fallback
  2. Copy from DM DEMO "D:\nginx-1.15.0\conf\nginx.conf" file and put it at the same location in new client machine. The most important ePM nginx part is:

```sh
		#EPM SIGNING					
		location /initEPMSign {
			 add_header 'Access-Control-Allow-Origin' '*';
			 add_header 'Access-Control-Allow-Methods' 'POST, OPTIONS, GET';
			 proxy_pass  http://localhost:97/initEPMSign;
			 proxy_pass_request_headers      on;
		}								
		
		location /signingEPMStatus {
			 add_header 'Access-Control-Allow-Origin' '*';
			 add_header 'Access-Control-Allow-Methods' 'POST, OPTIONS, GET';
			 proxy_pass  http://localhost:97/signingEPMStatus;
			 proxy_pass_request_headers      on;
		}			
		#END OF EPM SIGNING
```

  4. Copy from DM DEMO Signing_Proxy application "D:\nginx-1.15.0\node\Signing_Proxy\" to same path in new client machine.
  5. Export CS folder "CS - Applications - Signing Services" from DM DEMO ECM. Import in "CS - Applications" folder in new client ECM.
  6. DMCSUISIGN module install - take module (dmcsuisign_16_2_10) from https://github.com/mihailsgo/DM-SS-ECM-SmartUI-module.
  7. Add ActiveView overrides for "Function Menu" and "Promoted Commands" in classic view. Take override files here: https://github.com/mihailsgo/DM-SS-ECM-SmartUI-module/tree/main/ECM%20overrides."Function Menu.html" file for "Function Menu" override, "Promoted Commands.html" for "Promoted commands" override.
  8. Deliver small node.js app from DM DEMO (D:\nginx-1.15.0\node\Eparaksts\). This application is created to process returnURI after eparaksts homepage redirects user. Example: company X has registered such returnURI in LVRTC: https://demo.digitalmind.lv/identity?return=true. It means after user has entered all credentials at LVRTC homepage, he got redirecter to address with 2 additional parameters added by LVRTC https://demo.digitalmind.lv/identity?return=true&code=XXXXX&state=YYYYYY. This requested should be recieved by this application`s /identity API. This small application is not the only one possible solution, but just an example of how returnURI could be processed.
  9. After client has negotiated ePM contract with LVRTC, fill authentication and container-and-signature services .yaml files with the data and restart services: 
  ![image](https://user-images.githubusercontent.com/3802544/234606602-ccd9f7b6-7bd7-408d-8315-1d4951a3ed7a.png)
  9. Separately adjust **CS CUSTOM SOLUTIONS** browse view component to support signing.

## Scenario Nr. 2: Updating existing DM SS SmartUI module to latest version / updating DM SS SmartUI module to support eparakstsMobile (ePM)
  1. Microservices should be updated to latest version.
  2. Unistall such modules if they are installed: DMCSUIINFO un CREATECONTAINER.
  3. DMCSUISIGN module install - take module (dmcsuisign_16_2_10) from https://github.com/mihailsgo/DM-SS-ECM-SmartUI-module.
  4. Changes in ECM:<br/>
  &nbsp;&nbsp; 4.1. Location: Signing Service (SS)/08. SmartUI/View - Signatures - SmartUI/Signatures (ssViewSignaturesCSUI) WR<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;ToDo: A) Take WR content from DM DEMO: https://demo.digitalmind.lv/otcs/llisapi.dll/info/6757203<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; B) Set nikname "ssViewSignaturesCSUI"<br/>
  &nbsp;&nbsp; 4.2. Location: Signing Service (SS)/08. SmartUI/View - Signatures - Browse View/Signatures (ssViewSignaturesBrowseView) LR<br/> 
  &nbsp;&nbsp;&nbsp;&nbsp;ToDo: A) Create<br/>
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; B) Take LR content from DM DEMO: https://demo.digitalmind.lv/otcs/llisapi.dll/info/6874463<br/>
   &nbsp;&nbsp;    4.3. Location: Signing Service (SS)/08. SmartUI/View - Signatures - Browse View/Signatures (ssViewSignaturesBrowseView) WR<br/> 
  &nbsp;&nbsp;&nbsp;&nbsp;	  ToDo:<br/> 
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;		A) Add source - LR from 4.2.<br/>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;		B) Take WR content from DM DEMO: https://demo.digitalmind.lv/otcs/llisapi.dll/info/6757200<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;     4.4. Location: Signing Service (SS)/08. SmartUI/View - Signatures - Browse View/SS adapter for AV overrides (ssViewSignaturesBrowseViewClassicAdapter) 
 &nbsp;&nbsp;&nbsp;&nbsp;	  ToDo:<br/>	
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;			A) Create<br/>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;			B) Take WR content: https://demo.digitalmind.lv/otcs/llisapi.dll/info/7057431<br/>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;			C) Set nickname "ssViewSignaturesBrowseViewClassicAdapter"<br/>
  5. Adjust REST Client WR object:<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;	  Location: Signing Service (SS)/08. SmartUI/REST Client WR<br/>
   &nbsp;&nbsp;&nbsp;&nbsp;  	  ToDo:<br/>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;			A) Take WR content: https://demo.digitalmind.lv/otcs/llisapi.dll/info/6757206
  6. Update Signing_Proxy nodeJS application D:\nginx-1.15.0\node\Signing_Proxy\app.js. Take content from /Signing_Proxy/app.js
  7. Deliver small node.js app from DM DEMO (D:\nginx-1.15.0\node\Eparaksts\). This application is created to process returnURI after eparaksts homepage redirects user. Example: company X has registered such returnURI in LVRTC: https://demo.digitalmind.lv/identity?return=true. It means after user has entered all credentials at LVRTC homepage, he got redirecter to address with 2 additional parameters added by LVRTC https://demo.digitalmind.lv/identity?return=true&code=XXXXX&state=YYYYYY. This requested should be recieved by this application`s /identity API. This small application is not the only one possible solution, but just an example of how returnURI could be processed.
  8. After client has negotiated ePM contract with LVRTC, fill authentication and container-and-signature services .yaml files with the data and restart services:
![image](https://user-images.githubusercontent.com/3802544/234606628-10858bf7-ce03-4d9c-bec3-50ea18cc0617.png)
  9. Separately adjust **CS CUSTOM SOLUTIONS** browse view component to support signing.
