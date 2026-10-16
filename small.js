function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

const result = numbers
  .reverse()                         
  .filter((n) => !isPrime(n))         
  .map((n) => {
    if (n % 15 === 0) return "FooBar"; 
    if (n % 3 === 0) return "Foo";    
    if (n % 5 === 0) return "Bar";   
    return n;
  });
  
console.log(result.join(", "));