package src;

public class Hello {

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

	}

}
