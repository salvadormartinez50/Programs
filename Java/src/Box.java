package src;

public class Box {
	//these are Business Methods
	public double getSurfaceArea() {
		return 2*height*width + 2*height*length + 2*width*length;
	}

	public double getVolume() {
		return height*width*length;
	}
	/////////////
	
	//This is a printBox Method
	public String printBox() {
		String message = "Length" + length + "\n"+ "Width = " + width + "\n" + "Heith = " + height + "\n" + "Volume = " +
				getVolume() + "\n" +  "Surface Area = " + getSurfaceArea() ;
		String result = (height<=0 || width <= 0 || length <= 0) ?  "the box contains invalid properties, review your entries!":
			message;
		return result;
	}
	
	//these are constructors
	public Box(double height) {
		//super();
		this(height, height, height);
	}
	public Box(double height, double width, double length) {
		super();
		this.height = height;
		this.width = width;
		this.length = length;
	}
	/////////////////
	
	private double height;
	private double width;
	private double length;
	
	
	public double getHeight() {
		return height;
	}
	public void setHeight(double height) {
		this.height = height;
	}
	public double getWidth() {
		return width;
	}
	public void setWidth(double width) {
		this.width = width;
	}
	public double getLength() {
		return length;
	}
	public void setLength(double length) {
		this.length = length;
	}

}
