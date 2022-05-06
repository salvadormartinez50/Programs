package src;

import java.time.LocalDate;
import java.time.Period;

public class Hello {
	
	//@SuppressWarnings("static-access")
	public static void main(String[] args) {
		
		Person myObj = new Person();
		myObj.setName("Salvador");
		System.out.println("Hello! " + myObj.getName());
		
		Animal myAnimal = new Animal();
		myAnimal.animalSound();
		
		Animal myPig = new Pig();
		myPig.animalSound();
		
		Animal mDog = new Dog();
		mDog.animalSound();
		
		var myNumber = new Numbers(); // use var or the class is the same
		System.out.println("The action of the numbersSum method");
		myNumber.numberSum(2000);
		System.out.println("The action of the numbersSum2 method");
		myNumber.numberSum2(500);
		System.out.println("The value of the numbersSum2 method");
		System.out.println(myNumber.numberSum2(500));
		
		//Statement myAge = new Statement(); this is only util when checkAge is public.
		Statement.checkAge(18); // Call the checkAge method and pass along an age of 18, we access directly by Statement because checkAge is static, only belong to this class

		var recursion = new Recursion();
		int result = recursion.sum(3);
		System.out.println(result);
		
		
		System.out.println("Accessing directly the class with static atributes.");
		int z = Datos.x;
		System.out.println(z);
		System.out.println(Datos.x);
		
		System.out.println("Using try-Catch");
		var myObj2 = new Trycatch();
		try {
	    myObj2.x = 25; // will generate an error: cannot assign a value to a final variable
	}finally{System.out.println("The final field Trycatch.x cannot be assigned");}
	    System.out.println(myObj2.x);
	    
	    System.out.println("Using Speed");
	    
	    int newSpeed = 134;
	    var speed = new Speed();
	    System.out.println(speed.getSpeed());// here only print the default value, it is not initialized
	    speed.setSpeed(newSpeed);
	    System.out.println(speed.getSpeed());
	    
	    Car car54 = new Car();
	    car54.setName("Car 54");
	    car54.setSpeed(newSpeed );
	    car54.setManufactured(LocalDate.of(1961, 9, 17));
	    System.out.println(Car.MAX_SPEED);
		
	    
	    // other way to initialize attributes with a different signature 
	    Car mach5 = new Car("Mach V", 260, 21, true);
	   // mach5.setName("Mach V"); with the new constructor-signature it is no more necessary
	   // mach5.setSpeed(250);     with the new constructor-signature it is no more necessary
	    mach5.setManufactured(LocalDate.of(1967, 4, 2));
	    
	    for (Car car: new Car[] {car54, mach5}) {
	    	System.out.printf(" %s  is %d years old and is traveling at %d mph %n", car.getName(), car.getAge(), car.getSpeed());
	    }
	    
	    mach5.setTirePressures(new int[] {32, 32, 40, 50, 80});
	    //or when we use ellipsis in the setTirePressures() method, we can make a call using several arguments
	    mach5.setTirePressures(32, 32, 40 ,50);
		//System.out.println(mach5.);
	    
	    System.out.println("handling Dates");
	    Fecha fechaDeNaciminto = new Fecha();
	    fechaDeNaciminto.setFecha(LocalDate.of(1971, 3, 12));
	    
	    System.out.println(fechaDeNaciminto.getFecha());
	    //System.out.printf("%d, fechaDeNaciminto.getFecha()");
	    System.out.println(LocalDate.now());
	    System.out.println(LocalDate.now().getYear());
	    System.out.println(Period.between(fechaDeNaciminto.getFecha(), LocalDate.now()).getYears());
	    
	    System.out.println("");
	    System.out.println("handing Business Methods");
	    
	    // Application of the Business Method
	    double height = 022;
	    double width = 23;
	    double length = 12;
		Box myBox = new Box(height, width, length);
		System.out.println( myBox.printBox());
	    
	}

}
