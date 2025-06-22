#find test/  -type f -name "*.js" | xargs  echo 
#find test/  -type f -name "*.js" 



#  Safe transforms:
#
#    + arrow .......... callback to arrow function
#    + arrow-return ... drop return statements in arrow functions
#    + for-of ......... for loop to for-of loop
#    + for-each ....... for loop to Array.forEach()
#    + arg-rest ....... use of arguments to function(...args)
#    + arg-spread ..... use of apply() to spread operator
#    + obj-method ..... function values in objects to methods
#    + obj-shorthand .. {foo: foo} to {foo}
#    + no-strict ...... remove "use strict" directives
#    + exponent ....... Math.pow() to ** operator (ES7)
#    + multi-var ...... single var x,y; declaration to var x; var y; (refactor)
#
#  Unsafe transforms:
#
#    + let ............ var to let/const
#    + class .......... prototype assignments to class declaration
#    + commonjs ....... CommonJS module loading to import/export
#    + template ....... string concatenation to template string
#    + default-param .. use of || to default parameters
#    + destruct-param . use destructuring for objects in function parameters
#    + includes ....... indexOf() != -1 to includes() (ES7)


files=(`find test/  -type f -name "*.js" | sort`)

for file_name in "${files[@]}"; do
    echo ----------------------------- ${file_name} 
    cat ${file_name} 
    echo -----------------------------
    #npx lebab ${file_name} -o /var/tmp/lebab.js --transform  lets
    npx lebab ${file_name} -o /var/tmp/lebab.js --transform  let,class,commonjs,arrow,template
    echo ⇣
    cat /var/tmp/lebab.js
    echo ---
done
