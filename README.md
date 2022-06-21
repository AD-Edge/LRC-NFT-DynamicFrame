# LRC-NFT-DynamicFrame
A dynamic-frame template for canvas/html-based NFT dev on Loopring L2.

# About
This setup is designed to scale the canvas/NFT to fit in a variety of wallets.
This has been an issue I've run into given the lack of consistency between different wallet types we have now, its hard to know what size to set a canvas. Plus going into the unknown future we dont know wallet sizes will be supported or standard. So this is at least an attempt to plan ahead and future-proof a little. 

This template (by default) scales between a minimum of 320px (GME wallet smallest size) and maximum of 720px (for higher res requirements), but can be modified as needed.

<hr>

**Feedback Welcome!! (and appreciated)**

Alex.Delderfield@gmail.com

https://twitter.com/Alex_ADEdge

[delta-edge.com](http://www.delta-edge.com/)

delta.loopring.eth

<hr>

Feel free to use for your own html/canvas NFT needs.

Just credit me **(Alex Delderfield/twitter.com/Alex_ADEdge)** somewhere/sometime, and be sure to show me any neat NFTs this helps you make :D

# Version History & Notes

## Version 0.1 

Completed 21/06/2022 ([minted version here](https://lexplorer.io/nfts/0x22b60c6ff19b6590216d5a45a96de404cd1897d3-0-0xfe23138c751c8146f2787738ba63333240508901-0xd5cf18b4c18caabc96610b6cec708b99470140a339dd1eae8697321da0b61a8d-5))

Initial version features:

-Dynamic div scaling (to fit L2 wallets past present and hopefully future)

-'Doco'! An example character and dynamic element to demonstrate some interactivity

-A 'smoothly' scaling canvas, using a temp/memory based canvas to instantly copy content back to the primary canvas when rescaling

-'Size' display, the size of the canvas is dynamically displayed in the NFT to help with debugging

-Demo custom font & font loading

***Testing and feedback needed
