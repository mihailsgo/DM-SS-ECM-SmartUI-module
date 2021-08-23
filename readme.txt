  1. Microservices should be updated to latest version.
  2. Unistall such modules if they are installed: DMCSUIINFO un CREATECONTAINER.
  3. DMCSUISIGN module install - take newest version dmcsuisign_16_2_10.
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
