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

FROM_DIR="mxgraph/src/"
REPLACE_OLD="src"
REPLACE_NEW="src_es6"

files=(`find ${FROM_DIR}  -type f -name "*.js" | sort`)

for from_filename in "${files[@]}"; do
    echo ----------------------------- ${from_filename} 
    to_filename=${from_filename/${REPLACE_OLD}/${REPLACE_NEW}}
    to_dir=${to_filename%/*}
    echo ----------------------------- ${to_filename} 
    #echo ----------------------------- ${to_dir} 
    mkdir -p ${to_dir} 
    #npx lebab ${file_name} -o /var/tmp/lebab.js --transform  lets
    npx lebab ${from_filename} -o ${to_filename} --transform  let,class,commonjs,arrow,template
done
