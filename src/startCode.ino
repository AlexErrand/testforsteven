#if defined(ESP32)
#include <WiFiMulti.h>
WiFiMulti wifiMulti;
#define DEVICE "ESP32"
#elif defined(ESP8266)
#include <ESP8266WiFiMulti.h>
ESP8266WiFiMulti wifiMulti;
#define DEVICE "ESP8266"
#endif
#include "DHT.h"
#define DHT11_PIN 5
#define AOUT_PIN 32
#include <WiFi.h>
#include <InfluxDbClient.h>
#include <InfluxDbCloud.h>
#define INFLUXDB_URL "https://us-east-1-1.aws.cloud2.influxdata.com"
#define INFLUXDB_TOKEN "zRSZzTX7HfxDXvVF5TXbD3GHX7KP3bNNiuc4x8Z7WmERpeF3DaCpbDIBsHRUesIrHg-OPbpUi8IL_y41sh_XYQ=="
#define INFLUXDB_ORG "5f46006b8a9bac6b"
#define INFLUXDB_BUCKET "iotProject"
#define TZ_INFO "UTC-5"
const char* ssid = "NETGEAR83";
const char* password = "vanillabird713";
DHT dht11(DHT11_PIN, DHT11);
InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);
Point sensor("PlantSensor4");

void setup() {
  Serial.begin(9600);
  
    // Setup wifi
    WiFi.mode(WIFI_STA);
    wifiMulti.addAP(ssid, password);
  
    Serial.print("Connecting to wifi");
    while (wifiMulti.run() != WL_CONNECTED) {
      Serial.print(".");
      delay(100);
    }
    Serial.println();
  
    timeSync(TZ_INFO, "pool.ntp.org", "time.nis.gov");
  
  
    // Check server connection
    if (client.validateConnection()) {
      Serial.print("Connected to InfluxDB: ");
      Serial.println(client.getServerUrl());
    } else {
      Serial.print("InfluxDB connection failed: ");
      Serial.println(client.getLastErrorMessage());
    }
    sensor.addTag("device", DEVICE);
    sensor.addTag("SSID", WiFi.SSID());
  
}

void loop() {
  sensor.clearFields();
  
  sensor.addField("rssi", WiFi.RSSI());

  int moisture = analogRead(AOUT_PIN); // read the analog value from sensor

  Serial.print("Moisture: ");
  sensor.addField("moisture", moisture);
  Serial.println(moisture);

  float humi  = dht11.readHumidity();
  float tempC = dht11.readTemperature();
  float tempF = dht11.readTemperature(true);

  if (isnan(humi) || isnan(tempC) || isnan(tempF)) {
    Serial.println("Failed to read from DHT11 sensor!");
  } else {
    sensor.addField("humidity", humi);
    sensor.addField("tempC", tempC);
    sensor.addField("tempF", tempF);
  }
  
    Serial.print("Writing: ");
    Serial.println(sensor.toLineProtocol());
  
    if (wifiMulti.run() != WL_CONNECTED) {
      Serial.println("Wifi connection lost");
    }
  
    if (!client.writePoint(sensor)) {
      Serial.print("InfluxDB write failed: ");
      Serial.println(client.getLastErrorMessage());
    }
  
    Serial.println("Waiting 1 second");
    delay(1000);
  
}