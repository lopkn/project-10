def long_division(dividend, divisor):
    """
    Performs polynomial long division and returns the quotient and remainder.
    """
    quotient = []
    remainder = list(dividend)  # Make a copy of the dividend
    
    # Check for divide-by-zero error
    if len(divisor) == 0:
        raise ValueError("Cannot divide by zero")
    
    # Perform long division
    while len(remainder) >= len(divisor):
        # Calculate the next term of the quotient
        term = [0] * (len(remainder) - len(divisor)) + [remainder[-1] / divisor[-1]]
        quotient = term + quotient
        
        # Subtract the term times the divisor from the remainder
        for i in range(len(divisor)):
            remainder[i - len(divisor) + len(remainder)] -= term[-1] * divisor[i]
        
        # Remove any leading zeros from the remainder
        while len(remainder) > 0 and remainder[0] == 0:
            remainder.pop(0)
            
    return quotient, remainder

# while(True):
#     inp = input(str(num1)+"-"+str(num2)+" var: ")
#     if(inp == ""):
#         inp = "0"
#     if(inp.isnumeric()):
#         arr[num1-1].append(int(inp))
#         num2+=1
#     elif(inp == "+"):
#         arr.append([])
#         num1+=1
#         num2=1
#     elif(inp == "-"):
#          break;


an = long_division([1,2,3,4,5],[1,2,1])
print("hi")
print(an)




