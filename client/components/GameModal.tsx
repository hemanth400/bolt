@@ .. @@
   const gameProblems = {
     'Python Code Challenge': {
       problem: `Write a Python function that finds the maximum element in a list:
 
 def find_max(numbers):
     # Your code here
     pass
 
 # Example: find_max([1, 5, 3, 9, 2]) should return 9`,
       placeholder: `def find_max(numbers):
     # Write your solution here
-    return max(numbers)`
+    if not numbers:
+        return None
+    return max(numbers)`
     },
     'Java Algorithm Race': {
       problem: `Write a Java method that reverses a string:
 
 public class Solution {
     public String reverseString(String str) {
         // Your code here
         return "";
     }
 }
 
 # Example: reverseString("hello") should return "olleh"`,
       placeholder: `public String reverseString(String str) {
     // Write your solution here
     return new StringBuilder(str).reverse().toString();
 }`
     },
     'Frontend Debug Master': {
       problem: `Fix the CSS bug in this code to center the text:
 
 <div class="container">
     <p>This text should be centered</p>
 </div>
 
 .container {
     width: 100%;
     height: 200px;
     background: #f0f0f0;
     /* Add CSS properties to center the text */
 }`,
       placeholder: `.container {
     width: 100%;
     height: 200px;
     background: #f0f0f0;
     display: flex;
     align-items: center;
     justify-content: center;
 }`
     }
   };