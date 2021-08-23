Scenario 1: Deliver latest DM SS SMartUI module to new client
  1. Install microservices - container / archive / fallback
  2. Copy from DM DEMO Signing_Proxy application: D:\nginx-1.15.0\node\Signing_Proxy\ to same path
  3. Export CS folder from DM DEMO ECM: CS - Applications - Signing Services. Import at the same path in new client ECM.
  4. DMCSUISIGN module install - take module (dmcsuisign_16_2_10) from https://github.com/mihailsgo/DM-SS-ECM-SmartUI-module.
  5. Set Active View override for "Function Menu" (take override file ) and "Promoted Commands"
  6. + risinājumu Browse view modifikācijas lai ir pieejams no risinājumu formām
	

Scenario 2: Updating existing DM SS SMartUI module to latest version
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
