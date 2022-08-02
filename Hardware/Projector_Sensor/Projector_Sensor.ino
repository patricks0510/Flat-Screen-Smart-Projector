#include <stdio.h>
//ESP32Lib headers
#include <ESP32Lib.h>
#include <Ressources/Font6x8.h>

//pin configuration, change if you need to
const int trigPin1 = 32;
const int echoPin1 = 26;
const int trigPin2 = 33;
const int echoPin2 = 27;
const int trigPin3 = 25;
const int echoPin3 = 14;
long duration1;
float distance1;
long duration2;
float distance2;
long duration3;
float distance3;

void setup()
{
	Serial.begin(115200);  
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);
  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);
  pinMode(trigPin3, OUTPUT);
  pinMode(echoPin3, INPUT);
}

void loop()
{
  //SENSOR 1
  // Clears the trigPin
  digitalWrite(trigPin1, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin1, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin1, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration1 = pulseIn(echoPin1, HIGH);
  // Calculating the distance
  distance1 = duration1 / 58;

  //SENSOR 2
  // Clears the trigPin
  digitalWrite(trigPin2, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin2, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin2, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration2 = pulseIn(echoPin2, HIGH);
  // Calculating the distance
  distance2 = duration2 / 58;

  //SENSOR 3
  // Clears the trigPin
  digitalWrite(trigPin3, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin3, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin3, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration3 = pulseIn(echoPin3, HIGH);
  // Calculating the distance
  distance3 = duration3 / 58;

  //send sensor data thru serial
  Serial.print((String) "{\"J2\": \"" + distance1 + "\", \"J3\": \"" + distance2 + "\", \"J4\": \"" + distance3 + "\"}");
}
