import { Metadata } from 'next';
import { BlogArticleLayout } from '@/components/ui/blog-article-layout';
import { getBlogBySlug, generateBlogMetadata, generateBlogJsonLd } from '@/data/blogs-data';

export const dynamic = 'force-static';

const slug = 'raft-consensus-algorithm';
const blog = getBlogBySlug(slug)!;
const jsonLd = generateBlogJsonLd(slug)!;

export const metadata: Metadata = generateBlogMetadata(slug);

export default function RaftConsensusAlgorithmPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumbJsonLd) }}
      />
      <BlogArticleLayout
        title={blog.title}
        description={blog.description}
        date={new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        dateISO={blog.date}
        tags={blog.tags}
      >
        <p>
          I was looking at the Raft consensus algorithm. Why it exists, why it is so important in distributed systems. The reason is it purely solves this one problem: how do multiple machines agree on the same data, even when some of them fail?
        </p>
        <p>
          The mental model is simple. Say me and a group of friends are going out for dinner. One person decides which restaurant to go to, and the rest of them agree. That is consensus. One person leads, everyone else follows. If that person disappears, someone else steps up and decides. The group keeps moving as long as enough people are around to agree.
        </p>
        <p>
          Same idea for machines. When you distribute data across multiple servers, it is all about agreement. Who to follow, what the current state is, and making sure everyone has the same data. That is the entire game. Raft is the protocol that makes this work.
        </p>

        <h2>Three States, One Cluster</h2>
        <p>
          Say you have a cluster of five servers. In Raft, every server is always in exactly one of three states:
        </p>
        <ul>
          <li><strong>Follower</strong> - the default. Does not make decisions. Listens to the leader, replicates what the leader says.</li>
          <li><strong>Candidate</strong> - a follower that suspects the leader is dead and is trying to get elected.</li>
          <li><strong>Leader</strong> - the one server that handles all client requests and tells everyone else what to write.</li>
        </ul>
        <p>
          That is it. Every transition in Raft is a server moving between these three states. The entire protocol is just the rules for when and how those transitions happen.
        </p>

        <h2>The Lifecycle</h2>
        <p>
          When the cluster first boots, all five servers start as followers. No leader exists yet. Every server sets a randomized election timeout, a random duration between, say, 150ms and 300ms. The server just waits.
        </p>
        <pre><code>{`Server A: follower, timeout = 210ms
Server B: follower, timeout = 280ms
Server C: follower, timeout = 155ms  ← fires first
Server D: follower, timeout = 300ms
Server E: follower, timeout = 190ms`}</code></pre>
        <p>
          Server C&apos;s timer expires first. No heartbeat arrived. C assumes there is no leader, transitions to candidate, votes for itself, and sends vote requests to A, B, D, and E.
        </p>
        <pre><code>{`Server C → Candidate (term 1)
Server C votes for itself
Server C → RequestVote RPC → A, B, D, E`}</code></pre>
        <p>
          The others have not timed out yet, so they have not voted. They receive C&apos;s request, check the rules, and grant their vote. C gets a majority (3 out of 5, including itself) and becomes leader.
        </p>
        <pre><code>{`Server A: grants vote to C
Server B: grants vote to C
Server C: received 3 votes (A, B, self) → becomes Leader
Server C → sends heartbeats to A, B, D, E`}</code></pre>
        <p>
          The moment C becomes leader, it starts sending heartbeats. Every follower that receives a heartbeat resets its election timeout. As long as heartbeats keep arriving, no one else times out, and no new election starts. C stays leader indefinitely, even if no client sends a single request. It is not about having work to do. It is about proving you are alive.
        </p>
        <p>
          Now say C crashes. Heartbeats stop. The followers are all counting down independently. E has the shortest remaining time, so E times out first, becomes a candidate, and the cycle repeats.
        </p>
        <pre><code>{`Server C: crashes, heartbeats stop
Server E: timeout expires → becomes Candidate (term 2)
Server E: votes for itself, sends RequestVote to A, B, D
Server A: grants vote to E
Server D: grants vote to E
Server E: received 3 votes → becomes Leader (term 2)
Server E → sends heartbeats to A, B, D`}</code></pre>
        <p>
          The system healed itself. No human intervention, no restart. A follower noticed the leader was gone, stepped up, got elected, and took over. That is the lifecycle.
        </p>

        <h2>Elections: The Rules</h2>
        <p>
          Elections are not just &quot;whoever asks first wins.&quot; There are rules that prevent a stale server from taking over and corrupting the cluster.
        </p>
        <p>
          <strong>Rule 1: One vote per term.</strong> A server gives its vote only once in a given term. If server A already voted for E in term 2, and then B also asks for A&apos;s vote in term 2, A refuses. First valid request gets it.
        </p>
        <p>
          <strong>Rule 2: Your log must be up-to-date.</strong> A server only votes for a candidate whose log is at least as current as its own. Raft compares the last log entry&apos;s term and index. If the candidate&apos;s log is behind, the vote is denied. This is how Raft prevents a server that missed committed entries from becoming leader and overwriting them.
        </p>
        <pre><code>{`Server A log: [(term:1, "x=1"), (term:1, "y=2"), (term:2, "z=3")]
Server B log: [(term:1, "x=1")]

B becomes candidate, requests vote from A.
A checks: B's last entry is (term:1, index:1).
           A's last entry is (term:2, index:3).
           B is behind → A denies vote.`}</code></pre>
        <p>
          <strong>Rule 3: Majority wins.</strong> A candidate needs votes from <code>(n/2) + 1</code> servers. In a 5-node cluster, that is 3. This guarantees that at least one voter in the winning majority has every committed entry, so the new leader will too.
        </p>
        <p>
          What about split votes? In the rare case where two servers time out at nearly the same instant and both become candidates, they might split the vote. Neither gets a majority. The term ends with no leader. Each server picks a new random timeout, and the next election resolves it. The randomization makes back-to-back split votes extremely unlikely.
        </p>

        <h2>Heartbeats</h2>
        <p>
          This confused me at first. The leader sends heartbeats &quot;continuously&quot; but what does that actually mean? Does it lose leadership if there are no new writes for a while?
        </p>
        <p>
          No. A heartbeat is just an empty AppendEntries RPC. No log data, just a ping. The leader sends one at a fixed interval, say every 50ms, whether or not any client has made a request. Every heartbeat resets the election timeout on every follower. So as long as the leader is alive and the network is not partitioned, no election ever triggers.
        </p>
        <pre><code>{`Leader C: AppendEntries(entries=[], term=1) → A, B, D, E  (every 50ms)

Follower A: received heartbeat, reset timeout to 230ms
Follower B: received heartbeat, reset timeout to 195ms
Follower D: received heartbeat, reset timeout to 270ms
Follower E: received heartbeat, reset timeout to 160ms`}</code></pre>
        <p>
          When the leader dies, the pings stop. Timers expire. A new election starts. The system self-heals.
        </p>

        <h2>Log Replication</h2>
        <p>
          The leader is the only server that accepts client requests. A client sends a write, the leader appends it to its own log, and immediately sends the entry to all followers via AppendEntries RPCs. Each entry carries the command and the term it was received in.
        </p>
        <pre><code>{`Client → Leader: "SET x = 5"

Leader log: [..., (term:2, index:7, "SET x = 5")]
Leader → AppendEntries(term:2, index:7, "SET x = 5") → A, B, D, E`}</code></pre>
        <p>
          When a majority of followers acknowledge they have stored the entry, the leader considers it committed. It applies the entry to its state machine, responds to the client, and followers apply it on the next heartbeat.
        </p>
        <pre><code>{`A: stored → ACK
B: stored → ACK
D: stored → ACK     ← 3 ACKs + leader = 4/5 majority
E: network delay, has not responded yet

Leader: entry at index 7 is committed.
Leader: applies "SET x = 5" to state machine.
Leader: responds to client: "OK"`}</code></pre>
        <p>
          The majority requirement is the core of durability. A committed entry exists on more than half the servers. Any future leader must have been voted in by a majority, which means at least one voter had that entry. The voting rules ensure that voter would not vote for a candidate without it. So committed data is never lost, even if the leader crashes immediately after committing.
        </p>

        <h2>How the Leader Fixes Inconsistent Logs</h2>
        <p>
          Logs can get out of sync. A follower might have missed entries because it was down. Or it might have stale entries from a previous leader that got replaced before those entries were committed.
        </p>
        <p>
          Every AppendEntries RPC includes the index and term of the entry immediately before the new ones. The follower checks: do I have an entry at that index with that term? If yes, the logs match up to that point, and the new entries are appended. If no, the follower rejects the RPC.
        </p>
        <pre><code>{`Leader log:   [(1,"x=1"), (1,"y=2"), (2,"z=3"), (2,"w=4")]
Follower log: [(1,"x=1"), (1,"y=2"), (1,"BAD")]

Leader sends: prevLogIndex=3, prevLogTerm=2, entries=[(2,"w=4")]
Follower checks index 3: has (term:1, "BAD"), expected term 2
→ REJECT

Leader backs up: prevLogIndex=2, prevLogTerm=1, entries=[(2,"z=3"), (2,"w=4")]
Follower checks index 2: has (term:1, "y=2"), matches
→ ACCEPT
→ Follower deletes "BAD", appends "z=3" and "w=4"

Follower log: [(1,"x=1"), (1,"y=2"), (2,"z=3"), (2,"w=4")]  ← matches leader`}</code></pre>
        <p>
          The leader&apos;s log always wins. Followers never push data upstream. Consistency flows in one direction: leader to followers.
        </p>

        <h2>What Happens When Servers Fail</h2>
        <p>
          Raft needs a majority to do anything. The math is simple:
        </p>
        <pre><code>{`Cluster size    Majority needed    Max failures tolerated
3               2                  1
5               3                  2
7               4                  3`}</code></pre>
        <p>
          If you have 5 servers and 3 fail, you are below majority. No new leader can be elected. No writes can be committed. The cluster freezes.
        </p>
        <p>
          But existing data is safe. The servers that are still alive retain their logs. Nothing is deleted, nothing is corrupted. The cluster is just paused. When enough servers recover and the majority is restored, a new election happens, a leader is elected, and the system picks up exactly where it left off.
        </p>
        <p>
          This is the fundamental tradeoff. Raft will never let you write data that could be lost or create conflicting states across the cluster. If the cost of that guarantee is temporarily refusing to accept writes, Raft pays it without hesitation.
        </p>

        <p>
          If you want to go deep, read the original paper: <a href="https://raft.github.io/raft.pdf" target="_blank" rel="noopener noreferrer">In Search of an Understandable Consensus Algorithm</a>. This is just the simplified version.
        </p>

      </BlogArticleLayout>
    </>
  );
}
