package com.music.model;

import java.util.Random;

public class StockPrice {
	
	private static double stockPrice = 25.51;
	
	public static double getStockPrice() {
		 double newPrice = 0;
		 boolean up = new Random().nextBoolean();
		 
		 double low = .01;
		 double high = .25;
		 double change =  low + (high-low) * new Random().nextDouble();
		//System.out.println(change);
		 if(up) {
			 newPrice = stockPrice += change;
		 }else {
			 newPrice = stockPrice -= change;
		 }
	
		//System.out.println("new:" + newPrice);
		 stockPrice = newPrice;
		 return newPrice;
		 
	}
	

}
