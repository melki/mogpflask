import time
import os.path
import time
import os.path
import math
import random as rd

def createGrids(rMn, rMx, oMn, oMx, nbGrille):
    if(rMx - rMn) == 0:
        oIncr = int(math.floor(((oMx - oMn))*10)/10 )
    else:
        oIncr = int(math.floor(((oMx - oMn)/(rMx - rMn))*10)/10 )
    
    rangGrid = [0 for x in range((int(math.floor((rMx-rMn)/10))+1)*nbGrille)] 
    gridsToWrite = ""
    k=0
    f = "grilles_"+str(int(rMn))+"_"+str(int(rMx))+"_"+str(oMn)+"_"+str(oMx)+"_"+str(nbGrille)+"_#"+str(k)+".txt"
    start_time = time.time()
    while os.path.isfile(f):
        k+=1
        f = "grilles_"+str(int(rMn))+"_"+str(int(rMx))+"_"+str(oMn)+"_"+str(oMx)+"_"+str(nbGrille)+"_#"+str(k)+".txt"
    f=open(f,"w")
    
    
    for index in range(int(math.floor((rMx-rMn)/10))+1):
        
        o = oMn + index*oIncr*10
        print (o, oIncr)
        n = rMn + index*10
        
        
        grilles = [[[0 for x in range(n)] for x in range(n)] for x in range(nbGrille)]
        obsPos = [[(-1,-1) for x in range(o)] for x in range(nbGrille)]
        depart = [(-1,-1) for x in range(nbGrille)] 
        arrive = [(-1,-1) for x in range(nbGrille)] 
        card = ["" for x in range(nbGrille)] 
        cardList = ["est", "ouest", "sud", "nord"]

        for i in range(nbGrille):
            rangGrid[index*nbGrille+i] = int(rMn+index*10)
            
            for j in range(o):
                obsPos[i][j]=(-1,-1)
        for i in range(nbGrille):
           
            for j in range(o):
                pos = (-1,-1)
                while pos in obsPos[i]:
                    pos = (posX,posY) = int(math.floor(n * rd.random())),int(math.floor(n * rd.random()))
                obsPos[i][j]=pos
                grilles[i][posX][posY]=1
            
            while (depart[i] in obsPos[i]) or (depart[i] == (-1,-1) or ((d[0]-1,d[1]-1) in obsPos[i]) or ((d[0]-1,d[1]) in obsPos[i]) or ((d[0],d[1]-1) in obsPos[i])):
                depart[i] = 1+int(math.floor((n-2) * rd.random())),1+int(math.floor((n-2) * rd.random()))
                d=depart[i]
            while (arrive[i] in obsPos[i]) or (arrive[i] == (-1,-1)) or (a == depart[i] or ((a[0]-1,a[1]-1) in obsPos[i]) or ((a[0]-1,a[1]) in obsPos[i]) or ((a[0],a[1]-1) in obsPos[i])  ):
                arrive[i] = 1+int(math.floor((n-2) * rd.random())),1+int(math.floor((n-2) * rd.random()))
                a = arrive[i]
            indexCard = int(math.floor(rd.random()*4))
            card[i] = cardList[indexCard]            

        
        j=0
        for i in grilles:
            
            gridsToWrite +=str(int(rangGrid[j+index*nbGrille]))+" "+str(int(rangGrid[j+index*nbGrille]))+'\n'
            
            for x in i:
                for n in x:
                    gridsToWrite +=  str(int(n))+" "
                gridsToWrite +=  '\n'
            gridsToWrite +=  str(depart[j][0]) + " " + str(depart[j][1]) + " " + str(arrive[j][0]) + " " + str(arrive[j][1]) + " " +card[j] 
            gridsToWrite +=  '\n'
            gridsToWrite +=  '00'
            gridsToWrite +=  '\n'
            j = j+1
    f.write(gridsToWrite)        
    f.close()
    timeElapsed = time.time() - start_time
    return timeElapsed


def getListOfGrids():
    l = []

    for file in os.listdir("."):
        if file.startswith('grille'):
            if file.endswith(".txt"):
                f = file.split("_")
                e = (int(math.floor((int(f[2])-int(f[1]))/10))+1)*int(f[5])
                z = (a,b,c,d,e,h) = f[1],f[2],f[3],f[4],e,file
                l.append(z)

    return l

def getInfosGrid(data):
    nameF = str(data.split("##")[1])
    idG = data.split("##")[0]
    f =open(nameF,"r")
    
    l = f.readlines()
    l = ''.join(l)
    l =  str(l)
    l = l.split("00\n")

    r = l[int(idG)-1]

    return r

def deleteGrids():
    for file in os.listdir("."):
        if file.startswith('grille'):
            if file.endswith(".txt"):
                os.remove(file)
                print file
    return True