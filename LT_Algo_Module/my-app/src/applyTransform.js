/*
pixelsInCartesian = [][]

for(i;j, data buffer, steps of 4)
	calculate x, y from i+j
		x = sum % width of png
		y = floor(sum / width)
		center coordinates
	for(within those 4)
		create pixel object, add to array
			-a,r,g,b from data buffer
			-x
			-y
		add to pixelsInCartesian

modPixelsInCart = [][]

for(i;j, pixelsInCartesian, +1)#nested
	apply lin transform to pixels x,y variables
	create new pixel with that a,r,g,b and modified x,y
	add to modPixelsInCart[i][j]

for(i,data buffer, steps of 4)
	corner coordinates
	add to output buffer in y then x order

send output buffer to encode function
*/