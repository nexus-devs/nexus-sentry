import re


# Remove redundant characters
def cleanAll(Msg):

    Msg = [each.replace('ï¬', 'fl') for each in Msg]
    Msg = [each.replace('\n', '') for each in Msg]
    Msg = [each.replace('\s \n', '') for each in Msg]

    Filters = ['â€˜', 'Ã', 'Â', 'Â»', 'â€”', '>', '+', '*', '!', '<', '=', '/', '\b', '[', ']', '|', '(', ')', ',', "'"]

    for i in range(0, len(Filters)):
        Msg = [each.replace(Filters[i], ' ') for each in Msg]

    Msg = list(filter(None, Msg))
    return (Msg)



# Clean after username is assigned
def cleanBody(Msg, Username):

    # Remove Username from array
    if not Username == '':
        Msg.remove(Username)

    # Remove redundant characters
    Msg = [each.replace('-', '') for each in Msg]
    Msg = [each.replace('.', '') for each in Msg]
    Msg = [each.replace(':', ' ') for each in Msg]

    # Remove None Types
    Msg = filter(None, Msg)

    # All-Caps for uniform item names
    Msg = [each.upper() for each in Msg]

    return(Msg)



# Optimize input line for processing
def convertLine(Msg):

    global MsgWordsOriginal

    # Split each word of sentence
    MsgWords = re.sub("[^\w+.-]", " ",  Msg).split()

    # Take 'Backup' of original str for debugging
    MsgWordsOriginal = Msg

    return (MsgWords)
