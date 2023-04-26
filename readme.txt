Scenario Nr. 1: Deliver latest DM SS SmartUI module to new client
  1. Install microservices - container / archive / fallback
  2. Copy from DM DEMO "D:\nginx-1.15.0\conf\nginx.conf" file and put it at the same location in new client machine.
  3. Copy from DM DEMO Signing_Proxy application "D:\nginx-1.15.0\node\Signing_Proxy\" to same path in new client machine.
  4. Export CS folder "CS - Applications - Signing Services" from DM DEMO ECM. Import in "CS - Applications" folder in new client ECM.
  5. DMCSUISIGN module install - take module (dmcsuisign_16_2_10) from https://github.com/mihailsgo/DM-SS-ECM-SmartUI-module.
  6. Add ActiveView overrides for "Function Menu" and "Promoted Commands" in classic view. Take override files here: https://github.com/mihailsgo/DM-SS-ECM-SmartUI-module/tree/main/ECM%20overrides."Function Menu.html" file for "Function Menu" override, "Promoted Commands.html" for "Promoted commands" override.
  7. Separately adjust solution browse view component to support signing (should be discussed with SS team to define estimate for such activities - very individual for each client).
  8. Deliver small node.js app from DM DEMO (D:\nginx-1.15.0\node\Eparaksts\). This application is created to process returnURI after eparaksts homepage redirects user. Example: company X has registered such returnURI in LVRTC: https://demo.digitalmind.lv/identity?return=true. It means after user has entered all credentials at LVRTC homepage, he got redirecter to address with 2 additional parameters added by LVRTC https://demo.digitalmind.lv/identity?return=true&code=XXXXX&state=YYYYYY. This requested should be recieved by this application`s /identity API. This small application is not the only one possible solution, but just an example of how returnURI could be processed.
  9. After client has negotiated ePM contract with LVRTC, fill authentication and container-and-signature services .yaml files with the data: 
  

Scenario Nr. 2: Updating existing DM SS SmartUI module to latest version / updating DM SS SmartUI module to support eparakstsMobile (ePM)
  1. Microservices should be updated to latest version.
  2. Unistall such modules if they are installed: DMCSUIINFO un CREATECONTAINER.
  3. DMCSUISIGN module install - take module (dmcsuisign_16_2_10) from https://github.com/mihailsgo/DM-SS-ECM-SmartUI-module.
  4. Changes in ECM:
     4.1. Location: Signing Service (SS)/08. SmartUI/View - Signatures - SmartUI/Signatures (ssViewSignaturesCSUI) WR  
          ToDo: A) Take WR content from DM DEMO: https://demo.digitalmind.lv/otcs/llisapi.dll/info/6757203		       
		B) Set nikname "ssViewSignaturesCSUI"
     4.2. Location: Signing Service (SS)/08. SmartUI/View - Signatures - Browse View/Signatures (ssViewSignaturesBrowseView) LR 
          ToDo: A) Create
		B) Take LR content from DM DEMO: https://demo.digitalmind.lv/otcs/llisapi.dll/info/6874463
     4.3. Location: Signing Service (SS)/08. SmartUI/View - Signatures - Browse View/Signatures (ssViewSignaturesBrowseView) WR 
	  ToDo: 
		A) Add source - LR from 4.2.
		B) Take WR content from DM DEMO: https://demo.digitalmind.lv/otcs/llisapi.dll/info/6757200
     4.4. Location: Signing Service (SS)/08. SmartUI/View - Signatures - Browse View/SS adapter for AV overrides (ssViewSignaturesBrowseViewClassicAdapter) 
	  ToDo:	
		A) Create
		B) Take WR content: https://demo.digitalmind.lv/otcs/llisapi.dll/info/7057431
		C) Set nickname "ssViewSignaturesBrowseViewClassicAdapter"
  5. Adjust REST Client WR object:
    	  Location: Signing Service (SS)/08. SmartUI/REST Client WR
     	  ToDo:
		A) Take WR content: https://demo.digitalmind.lv/otcs/llisapi.dll/info/6757206
  6. Update Signing_Proxy nodeJS application D:\nginx-1.15.0\node\Signing_Proxy\app.js. Take content from /Signing_Proxy/app.js
  7. Deliver small node.js app from DM DEMO (D:\nginx-1.15.0\node\Eparaksts\). This application is created to process returnURI after eparaksts homepage redirects user. Example: company X has registered such returnURI in LVRTC: https://demo.digitalmind.lv/identity?return=true. It means after user has entered all credentials at LVRTC homepage, he got redirecter to address with 2 additional parameters added by LVRTC https://demo.digitalmind.lv/identity?return=true&code=XXXXX&state=YYYYYY. This requested should be recieved by this application`s /identity API. This small application is not the only one possible solution, but just an example of how returnURI could be processed.
  8. After client has negotiated ePM contract with LVRTC, fill authentication and container-and-signature services .yaml files with the data:
