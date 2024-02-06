import sys

print("READY")

for line in sys.stdin:
    print("PYTHON RECEIVED: %s" % line.strip())