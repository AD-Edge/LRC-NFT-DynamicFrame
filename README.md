# LRC-NFT-DynamicFrame
A dynamic-frame template for canvas/html-based NFT dev on Loopring L2.

![v0.1IMGDEMO](dynamic_resize01op2.gif)

# About
This template is designed to scale a html/canvas NFT to display at the ideal size in _any_ wallet.

This has been an issue I've run into given the lack of consistency between different wallet types we have now, its hard to know what size to set a canvas - so why not dynamically scale it for any wallet specifications?? Going into the future we dont know wallet sizes will be supported or standard. So this is my setup to plan ahead and future-proof a little for canvas/html based NFTs.

This template (by default) scales between a minimum of 320px (GME wallet display size as of JUNE '22) and maximum of 720px (for higher res requirements), but it can be modified easily as needed.

<hr>

**Feedback Welcome!! (and appreciated)**

Alex.Delderfield@gmail.com

https://twitter.com/Alex_ADEdge

[delta-edge.com](http://www.delta-edge.com/)

delta.loopring.eth

<hr>

Feel free to use for your own html/canvas NFT needs.

Just credit me **(Alex Delderfield - twitter.com/Alex_ADEdge)** somewhere/sometime, and be sure to show me any neat NFTs this helps you make :D

<hr>

# Version History & Notes

## Version 0.1 (21/06/2022)

See [**here for a dynamic demo**](http://delta-edge.com/DynamicFrameDemo/) (best to open this demo and resize the window to see the rescale in action)

Or see [**here for a minted LRC-NFT version**](https://lexplorer.io/nfts/0x22b60c6ff19b6590216d5a45a96de404cd1897d3-0-0xfe23138c751c8146f2787738ba63333240508901-0xd5cf18b4c18caabc96610b6cec708b99470140a339dd1eae8697321da0b61a8d-5)

Initial version features:

-Dynamic div scaling (to fit L2 wallets past present and hopefully future)- the best way I've found to do this is create a 'container' div _(nftBOX)_ which has the CSS **'min-height: 320px; min-width: 320px; max-height: 720px; max-width: 720px; height: 100%; aspect-ratio: 1/1;'** - these values are **key**. The canvas is setup within this container div, with width and height set to 100%. A javascript function handles the dynamic window resize (might not ever happen for an NFT but still handy to have just in case) + keeps all elements at a relative scale (so everything within the NFT scales to fit the NFT size in different wallets)

-'Doco'! An example character and dynamic element to demonstrate some interactivity

-A 'smoothly' scaling canvas, using a temp/memory based canvas to instantly copy content back to the primary canvas when rescaling

-'Size' display, the size of the canvas is dynamically displayed in the NFT to help with debugging

-Demo custom font & font loading

***Testing and feedback needed
