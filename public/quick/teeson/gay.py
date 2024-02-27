per = []
N = int(input())
for i in range(N):
    per.append( int(input()) )

n2 = int(N/2)
a = 0
for i in range(n2):
    if(per[i] == per[i+n2]):
        a+=2;
print(a)