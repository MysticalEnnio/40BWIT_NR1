How the generateOutput function works:



log steps took



check if car is before car:

​	car is before:

​		is front or back before car:

​			front:

​				can move car to left:

​					yes:

​						logStep("move (carToMove) to left")

​			back:

​				can move car to right:

​					yes:

​						logStep("move (carToMove) to right")

​	car is not before:

​		nothing to move

