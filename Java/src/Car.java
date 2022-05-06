package src;

import java.time.LocalDate;
import java.time.Period;
import static java.lang.Math.min;

public class Car {
	
	//public void setTirePressures(int[] pressures) {}   // only work with calls int[]
	public void setTirePressures(int ... pressures) {}  // this wrk fine in both cases in int[] and in several parameters
	//public void setTirePressures(int pressure, int pressure2, int pressure3, int pressure4) {} and only work with calls of several ints
	
	// printf(String format, Object ... args)
	
	public Car() {
	}
	
	public Car(String name) {
		this(name, 0, 0, false);
	}
	
	public Car(String name, int speed, int fuel, boolean running) {
		setName(name);
		setSpeed(speed);
		setGasoline(fuel);
		setEngineState(running);
		
	}
	
	static final int MAX_SPEED = 100;

	

	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	private int speed;

	public int getSpeed() {
		return speed;
	}

	public void setSpeed(int newSpeed) {
		System.out.println("This is MAX_SPEED " + Car.MAX_SPEED);
		System.out.println("This is newSpeed  " + newSpeed);
		//this.speed = newSpeed <= MAX_SPEED ? newSpeed:MAX_SPEED;
		//this.speed = Math.min(newSpeed, MAX_SPEED);   // Other way to do the same
		this.speed = min(newSpeed, MAX_SPEED);   // Again other way to do the same thru the "import static java.lang.Math.min;"
		System.out.println("This is the speed  " + speed);
	}
	
	private int gasoline;
	private boolean engineState;
	
	private LocalDate manufactured;

	public LocalDate getManufactured() {
		return manufactured;
	}

	public void setManufactured(LocalDate manufactured) {
		this.manufactured = manufactured;
	}
	public int getAge() {
		return Period.between(getManufactured(), LocalDate.now()).getYears();
	}

	public int getGasoline() {
		return gasoline;
	}

	public void setGasoline(int gasoline) {
		this.gasoline = gasoline;
	}

	public boolean isEngineState() {
		return engineState;
	}

	public void setEngineState(boolean engineState) {
		this.engineState = engineState;
	}
	
}
