# Just a blueprint, not implemented
!!!NOTE: partitions contain found item AND its possible components

# Describes the request for all items in a given string
class Request:


    # Make message available to sub methods, then interpret
    def __init__(self, message):
        self.message = message
        self.interpret()


    # Logic which transforms string into array of requests
    def interpret(self):

        # Get markers for where new items start.
        # Once we have those, we can look at each offered item individually.
        self.getMarkers()

        # Get each offer from the partitioned message
        self.getOffers()


    # Match each word and its follow-ups against givne item list
    def getMarkers():
        print()


    # Takes each partitioned message partition and analyzes contents
    def getOffers(self):
        for partition in self.partitions:

            # See if we can find any offer type keyword like 'selling'.
            # If not, assign current index of detected keywords.
            # If yes, increase index and save keyword in detected list.
            self.getOfferType(self, partition)

            # Look for Sub-Components for given item in partition.
            # If multiple components given, expect them to belong to the item
            # specified in the partition. This check also determines given
            # component price, rank, amount.
            self.getSubComponents(self, partition)


    # Get 'Selling'/'Buying' attributed to partition
    def getOfferType(self, partition):
        print()


    # Get components belonging to partition's main item and identify values
    def getSubComponents(self, partition):
        detected = []

        for i in range(len(partition.message)):

            # Found component? New object, increase index for assignment
            if self.isComponent(self, partition, i):
                component = {
                    name: "blabla"
                }
                detected.push(component)

            if self.isPrice(self, partition, i):
                component.price = "whatever"

            if self.isRank(self, partition, i):
                component.rank = "you get the drill, same for count"


    # Match i + length of remaining message against possible components
    def isComponent(self, partition, i):
        print()
        # is immediate neighbour matching with current and next component word?
        # if yes -> continue to next word in component
        # if no -> break, return false


    # Match immediate neighbours against price pattern
    def getSubComponentValues(self, partition, i):
        print()
