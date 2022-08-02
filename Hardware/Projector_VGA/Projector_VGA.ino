//This example acts like a websever. It can create an access point or join an existing WiFI network.
//All text that's entered in the served page will bis displayed on the connected VGA screen.
//You need to connect a VGA screen cable to the pins specified below.
//cc by-sa 4.0 license
//bitluni

#include <stdio.h>
#include <WiFi.h>
#include <WebServer.h>
//ESP32Lib headers
#include <ESP32Lib.h>
//#include <Ressources/Font6x8.h>

//true: creates an access point, false: connects to an existing wifi
const bool AccessPointMode = true;
//wifi credentials (enter yours if you arne not using the AccessPointMode)
const char *ssid = "VGA";
const char *password = "";

//pin configuration, change if you need to
const int redPin = 14;
const int greenPin = 19;
const int bluePin = 27;
const int hsyncPin = 32;
const int vsyncPin = 33;
short y = 0;
short x = 0;
byte image[15000];
bool newImage = false;
//String image;

String distances = "waiting for sensors...";

//the webserver at pot 80
WebServer server(80);

//The VGA Device
VGA3Bit vga;

//include html page
const char *page =
#include "page.h"
  ;

///Html page is sent on root
void sendPage()
{
	server.send(200, "text/html", page);
}

///Received text will be displayed on the screen
void text()
{
	//vga.println(server.arg(0).c_str());
  server.arg(0).getBytes(image, 15000);
  //image = server.arg(0).c_str();
  newImage = true;
  server.send(200, "text/plain", "ok");
}

void sensors()
{
  server.send(200, "text/plain", distances);
}

///initialization
void setup()
{
	Serial.begin(115200);
	//Handle the WiFi AP or STA mode and display results on the screen
	if (AccessPointMode)
	{
		Serial.println("Creating access point...");
		WiFi.softAP(ssid, password, 6, 0);
	}
	else
	{
		Serial.print("Connecting to SSID ");
		Serial.println(ssid);
		WiFi.begin(ssid, password);
		while (WiFi.status() != WL_CONNECTED)
		{
			delay(500);
		}
	}
	//start vga on the specified pins
	vga.init(vga.MODE400x300, redPin, greenPin, bluePin, hsyncPin, vsyncPin);
	//make the background blue
	//vga.clear(vga.RGBA(0, 0, 255));
  vga.clear(0);

	//send page on http://<ip>/
	server.on("/", sendPage);
	//receive text on http://<ip>/text
	server.on("/text", text);
  //send distance data on http://<ip>/sensors
  server.on("/sensors", sensors);
	//start the server
	server.begin();
}

void loop()
{
	//process the server stuff
	server.handleClient();

  //check for sensor update
  if (Serial.available() > 0) {
    distances = Serial.readStringUntil('}');
    distances += "}";
  }

  //check for image updates
  if(newImage) {
    for (int i = 0; i < 15000; i++) {
      for(int count = image[i] - 1; count > 0; count--) {
        vga.dot(x, y, 255 * (i % 2));
        if(x < 399) {x++;}
        else if (y < 299) {x = 0; y++;}
        else {break;}
      }
      if(x >= 399 && y >= 299) {x = 0; y = 0; break;}
    }
    x = 0;
    y = 0;
    newImage = false;
  }
  /*if(newImage) {
    newImage = false;
    for(int col = 0; col < 50; col++) {
      for(int b = 0; b < 8; b++) {
        if(bitRead(image[col], b)) {
            vga.dot((col*8)+b, y, 255);
        } else {vga.dot((col*8)+b, y, 0);}
      }
    }
    
    if(y <= 300) {
      y++;
    } else {
      y = 0;
    }
  }*/
}
