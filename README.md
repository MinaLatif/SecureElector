# Secure Elector
## Revolutionizing how we choose leaders

### What is Secure Elector?
As technology grows more and more complex,
some of the most vital services in our society still
lag far behind the modern times.

Secure Elector is a brand new, modern way for
leaders, businesses, and governments to conduct elections
in an open and secure way.

Secure Elector uses the cutting edge new technology
known as Blockchain to keep votes incorruptable and open,
while also keeping the identities of those who vote private.
Votes hashed into a block added to the blockchain ledger,
where they are locked in place, forever unchangeable,
thereby preventing tampering of votes.

Secure Elector also makes use of IBM Watson's
machine learning APIs for image classification,
which we use for face detection, to authenticate users
and verify someone is who they claim they are.

### Installation and testing

Secure Elector should only require Node.js and
a quick `npm install` from the terminal to get up and running.

**Windows users should run `npm install -g windows-build-tools` from a command window
with administrator privileges before running npm install.**

Once the dependencies are installed, you can start the
NodeJS server by running `npm start` from the terminal.

#### RPC address availability
This service relies on a pre-configured blockchain network
that was available during the creation of this project
at Hack Western 4 (November 2017) to help hackers
create blockchain applications without worrying about setup time.

The servers used in here may not be available
by the time you see this project, but this *should* work
with any custom RPC addresses you give it, though we offer no guarantees.

#### IBM Watson API key availability
This service also relies on a custom classifier
created during the course of Hack Western 4,
which provided unlimited calls and training during the event.
It's kinda safe to say that key won't work by the time
you'll see this project, but you should be able to
provide your own API key if you wish to use the
face detection authentication.