package src;

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
	    int newSpeed = 34;
	    var speed = new Speed();
	    System.out.println(speed.getSpeed());// here only print the default value, it is not initialized
	    speed.setSpeed(newSpeed);
	    System.out.println(speed.getSpeed());
		
		
	}

}
