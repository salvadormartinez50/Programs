package src;

public class Speed {
	private int speed;
    private int gasoline;
        
	public int getSpeed() {
		return speed;
	}
	public void setSpeed(int newSpeed) {
		this.speed = newSpeed;   // "this" can be omitted
		System.out.println(gasoline); //In this case only print the default value for an int data type, because gasoline is not initialized
	}
}
