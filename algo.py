#/usr/bin/python

#import de librairies necessaire
import time
import random as rd
import math
import numpy as np
import networkx as nx
# import matplotlib.pyplot as plt
from collections import deque as dq

nbObs = []
 
def createGraph():
    #creation du graphe vide
    G=nx.DiGraph()
    return G
 
def getInfos(entree,numeroLigne):

    #Lecture des lignes et des colonnes a partir du fichier d'entree
    fh = open(entree, "r")
    a = fh.readlines()
    m = int(a[0+numeroLigne].split(" ")[0])
    n = int(a[0+numeroLigne].split(" ")[1].split("\n")[0])
 
    #creation du tableau
    tableEntree= np.zeros((m,n))
 
    #compter les obs pour les logs
    o = 0

    #lecture du fichier source : 1:obstacle, 0:rien
    for i in range(m):
        for j in range(n):
            tableEntree[i][j] = a[i+1+numeroLigne].split(' ')[j]
            if tableEntree[i][j]==1:
                o+=1
    nbObs.append(o)            
    #recuperation de l'orientation initiale ainsi que la position de depart et d'arrivee.
    print m+1+numeroLigne
    infos = a[m+1+numeroLigne].split(' ')
    
    print infos[-1].split('\n')[0]
    if infos[-1].split('\n')[0] == "sud":
        dir = 2
    elif infos[-1].split('\n')[0] == "est":
        dir = 0
    elif infos[-1].split('\n')[0] == "nord":
        dir = 1
    else:
        dir = 3

    depart = (int(infos[0]),int(infos[1]),dir)
    arrivee = (int(infos[2]),int(infos[3]),dir)
    numeroLigne += m + 3
    
    if(len(a)==numeroLigne):
        go=False
    else:
        go=True
    
    return m,n,depart,arrivee,tableEntree,numeroLigne,go
 
   
def createNodes(G,m,n,tableEntree):
    #creation du tableau correspondant au graphe
    seq = np.zeros((m+1,n+1,4))
 
    #position et labels de chacun des noeuds
    pos = {}
    labels = {}
 
    for i in range(m+1):
        for j in range(n+1):
            for d in range(4):
                a = (i,j,d)
                G.add_node(a)
 
                #Attribution de la position et du labels, a des fins de visualisation, peut etre omis
                if d == 0:
                    pos[(i,j,d)]=(((5*j)+1+i*i*0.1,5*(m-i)-j*j*0.2))
                    labels[(i,j,d)] = 'E'
                if d == 1:
                    pos[(i,j,d)]=(((5*j)+i*i*0.1,(5*(m-i))+1-j*j*0.2))
                    labels[(i,j,d)] = 'N'
                if d == 2:
                    pos[(i,j,d)]=(((5*j)+i*i*0.1,(5*(m-i))-1-j*j*0.2))
                    labels[(i,j,d)] = 'S'
                if d == 3:
                    pos[(i,j,d)]=(((5*j)-1+i*i*0.1,5*(m-i)-j*j*0.2))        
                    labels[(i,j,d)] = 'W'
 
                #peut il circuler en ligne ?
                #oui si il n'est pas sur les bords
                if(j>0 and i>0 and j<n and i<m and tableEntree[i][j]==0 and tableEntree[i][j-1]==0 and tableEntree[i-1][j]==0 and tableEntree[i-1][j-1]==0):
 
                    #une case droite
                    if(j<n-1):
                        if(tableEntree[i][j+1]==0 and tableEntree[i-1][j+1]==0 and d == 0):
                            seq[i,j,d] = True
                    #une case gauche
                    if(j>1):
                        if(tableEntree[i][j-2]==0 and tableEntree[i-1][j-2]==0 and d == 3):
                            seq[i,j,d] = True        
 
                    #une case bas
                    if(i<m-1):
                        if(tableEntree[i+1][j]==0 and tableEntree[i+1][j-1]==0 and d == 2):
                            seq[i,j,d] = True
                    #une case haut
                    if(i>1):
                        if(tableEntree[i-2][j]==0 and tableEntree[i-2][j-1]==0 and d == 1):
                            seq[i,j,d] = True    
    return seq
 
def createEdge(G,m,n,seq):
 
    #Pour chaque noeud on regarde les noeud accessibles.                        
    for i in range(m+1):
        for j in range(n+1):
            for d in range(4):
 
                if( seq[i,j,d]==True and d==0):
                    G.add_edge((i,j,d),(i,j+1,d))
                    if(seq[i,j+1,d]==True):
                        G.add_edge((i,j,d),(i,j+2,d))
                        if(seq[i,j+2,d]==True):
                                G.add_edge((i,j,d),(i,j+3,d))
 
                if( seq[i,j,d]==True and d ==3):
                    G.add_edge((i,j,d),(i,j-1,d))
                    if(seq[i,j-1,d]==True):
                        G.add_edge((i,j,d),(i,j-2,d))
                        if(seq[i,j-2,d]==True):
                                G.add_edge((i,j,d),(i,j-3,d))
 
                if( seq[i,j,d]==True and d==1):
                    G.add_edge((i,j,d),(i-1,j,d))
                    if(seq[i-1,j,d]==True):
                        G.add_edge((i,j,d),(i-2,j,d))
                        if(seq[i-2,j,d]==True):
                                G.add_edge((i,j,d),(i-3,j,d))
 
 
                if( seq[i,j,d]==True and d==2):
                    G.add_edge((i,j,d),(i+1,j,d))
                    if(seq[i+1,j,d]==True):
                        G.add_edge((i,j,d),(i+2,j,d))
                        if(seq[i+2,j,d]==True):
                                G.add_edge((i,j,d),(i+3,j,d))
 
 
 
    #on ajoute aussi les liaison entre les 4 points cardianud (les 4 noeuds qui forment un des croisements du tableau initial)
 
                if(d==0):
                    G.add_edge((i,j,d),(i,j,1))
                    G.add_edge((i,j,d),(i,j,2))
                if(d==1):
                    G.add_edge((i,j,d),(i,j,3))
                    G.add_edge((i,j,d),(i,j,0))
                if(d==2):
                    G.add_edge((i,j,d),(i,j,3))
                    G.add_edge((i,j,d),(i,j,0))
                if(d==3):
                    G.add_edge((i,j,d),(i,j,1))
                    G.add_edge((i,j,d),(i,j,2))
    return G
 
#fonction pour la visualisation                
def visualize():
    nx.draw(G,pos=pos,labels=labels,font_size=10)
    # plt.show()


def bfs(g,s):
    
    # Initialisation & marquage de sommets non parcourus(-1)
    d={}
    p={}
    marqued={}
    for i in g.nodes():
        d[i]=-1
        marqued[i]=False

    marqued[s]=True
    d[s]=0
    Q = dq()
    Q.appendleft(s)# Liste FIFO

    # Iterations
    # tant que Q n'est pas vide
    while Q != dq([]):
        
        # u = defiler()Q
        u = Q.pop() # Retirer le premier sommet de la file
        vs = [ i for i in g.successors(u)]
        
        # Pour tous les voisins non-marques de u :
        for v in reversed(vs):
            if marqued[v]==False: #d[v] == -1 :
                Q.appendleft(v) # Ajouter v a la fin de la file
                d[v] = d[u]+1
                p[v] = u                
                marqued[v]=True
                
    return (d,p)


# Retourne Distance minimale d et chemin p associe
def chemin_plus_court(g,depart,arriveee):
    if(nx.has_path(g,source=depart,target=arriveee)):

        d,p = bfs(g,depart)
        
        chemin = [arriveee]
        distance = d[arriveee]
        x = p[arriveee]
        
        for i in range(distance-1):
            chemin.append(x)
            x = p[x]
            
        chemin.append(depart)
            
        return (distance-1,chemin[::-1])
    else:
        return (False,False)    

   

def parseResult(l):
    #fonction qui parse le resultat donne par l'algo pour en faire une chaine de fonction tourner et avancer
    sol = ''
    if l == False:
        sol = "No path for this one.."
        return sol
    for i in range(len(l)-1):
        if ((l[i][0],l[i][1]) == (l[i+1][0],l[i+1][1])):
           
            if (l[i][2],l[i+1][2]) in [(3,1),(2,3),(1,0),(0,2)]:
                sol = sol + 'D '
            if (l[i][2],l[i+1][2]) in [(3,2),(1,3),(0,1),(2,0)]:
                sol = sol + 'G '
 
        elif(l[i][0]==l[i +1][0]):
            t = abs(l[i+1][1] - l[i][1]);
            while(t>3):
                sol = sol + "a" + str(3)+" "
                t = t-3
            sol = sol +'a'+ str(t)+" "        
        elif(l[i][1]==l[i+1][1]):
            t = abs(l[i+1][0] - l[i][0]);
            while(t>3):
                sol = sol + "a"+str(3)+" "
                t = t-3
            sol = sol +'a'+ str(t)+" "

    if sol[len(sol)-2] == 'D' or sol[len(sol)-2] == 'G':
        sol =sol[:len(sol)-2]
    return sol

def main(entree):
    sol = []
    numeroLigne = 0
    numeroGraph = 0
    go = True
    while go == True:
        start_time = time.time()
        numeroGraph+=1
        print 'resolving grid #'+str(numeroGraph)
        G = createGraph()
        m,n,depart,arrivee,tableEntree,numeroLigne,go = getInfos(entree,numeroLigne)
        seq = createNodes(G,m,n,tableEntree)
        G = createEdge(G,m,n,seq)
        print depart,arrivee
        dis, l = chemin_plus_court(G,depart,arrivee)
        if(dis == False):
            a = parseResult(l)
        else:
            a =str(dis)+ " " + parseResult(l)
        timeElapsed = time.time() - start_time
        t = math.floor(timeElapsed*1000)/1000
        f = entree.split("_")
        o = nbObs[-1]
        with open("static/logs.csv", "a") as myfile:
            myfile.write(str(m)+","+str(o)+","+str(t)+"\n")
        sol.append({"sol":a,"dep":str(depart),"arr":str(arrivee),"num":numeroGraph,"grid":entree,"time":t,'rows':m,"obs":o})
    return sol
