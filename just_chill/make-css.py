import math

def main(AMPLITUDE, MULT):
	prefix = '''@keyframes sine-anim
{
    '''
	suffix = '''}

.sine-anim
{
    display: inline-block;
	transform-origin: center center 0px;
    animation-name: sine-anim;
    animation-duration: 4s;
    animation-play-state: running;
    animation-iteration-count: infinite;
    animation-delay: 0s;
}'''
	
	mid = ""
	
	for i in range(0, (100 * MULT) + 1, 1):
		val = -math.sin((math.pi * 0.02) * i / MULT) * AMPLITUDE
		
		th = "{0:0.3F}".format(val)
		
		mid += "{0:02F}".format(i / MULT) + "% { transform: translate(0px, " + th + "px); }\n" + ("    " if i != 100 else "")
		
	final = prefix + mid + suffix
	
	with open("stylesheet.css", "w+") as f:
		f.write(final)
		f.close()

if __name__ == "__main__":
	main(16, 2)