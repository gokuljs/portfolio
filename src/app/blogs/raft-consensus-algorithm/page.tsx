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

        <h2>Three States</h2>
        <p>
          In Raft, every server is always in one of three states:
        </p>
        <ul>
          <li><strong>Follower</strong> - the default state. Followers do not make decisions. They just listen to the leader and replicate whatever the leader tells them to.</li>
          <li><strong>Candidate</strong> - a follower that has not heard from a leader in a while. It is trying to become the new leader by requesting votes from others.</li>
          <li><strong>Leader</strong> - the one server that accepts all client requests, maintains the log, and replicates it to everyone else.</li>
        </ul>
        <p>
          When a cluster boots up, every server starts as a follower. No one is leader. No one is special. They are all just waiting.
        </p>
        <p>
          Each follower has its own randomized election timeout. This is a random duration, say between 150ms and 300ms, that the follower waits before deciding the leader might be dead. The randomization is deliberate. If every server had the same timeout, they would all try to become leader at the same time, split the votes, and nobody would win. Stagger the timeouts, and one server almost always times out first and wins cleanly.
        </p>

        <h2>Elections</h2>
        <p>
          When a follower&apos;s timeout expires without hearing from a leader, it assumes there is no leader. It transitions to candidate, increments its term number, votes for itself, and sends vote requests to every other server.
        </p>
        <p>
          Voting has rules. A server gives its vote only once per term. And it only votes for a candidate whose log is at least as up-to-date as its own. This is important. It is not purely first-come-first-serve. It is first <em>valid</em> candidate wins. A server with a stale log will not get votes from servers that have newer data. This is how Raft prevents a behind server from becoming leader and overwriting committed entries.
        </p>
        <p>
          If the candidate collects votes from a majority, it becomes leader. If it does not, the term ends, timeouts fire again, and another election starts. Eventually someone wins.
        </p>

        <h2>Heartbeats: What &quot;Continuously&quot; Actually Means</h2>
        <p>
          This confused me at first. The leader sends heartbeats continuously, but what does that actually mean? Does the leader get replaced if there are no new writes for a while?
        </p>
        <p>
          No. The leader stays leader as long as it keeps sending heartbeats. A heartbeat is just an empty AppendEntries RPC. No new log entries, just a signal that says &quot;I am still here.&quot; The leader sends these at a fixed interval, say every 50ms, regardless of whether any client has sent a request.
        </p>
        <p>
          Every time a follower receives a heartbeat, it resets its election timeout. So as long as the leader keeps pinging, no follower ever times out, and no election ever starts. The leader can sit idle with no client traffic for hours and still remain leader. It is not about having work to do. It is about proving you are alive.
        </p>
        <p>
          When the leader actually dies, the heartbeats stop. Followers stop getting their timers reset. One of them times out, transitions to candidate, and a new election begins. The system heals itself.
        </p>

        <h2>What Happens When the Leader Dies</h2>
        <p>
          Yes, each server has its own independent randomized timeout. When the leader crashes, every follower is independently counting down. The one with the shortest remaining timeout fires first, becomes a candidate, and sends vote requests.
        </p>
        <p>
          Think of it like five people in a room waiting for someone to speak up. Each person has a different threshold for how long they will wait. The most impatient person speaks first. The others hear the proposal and vote on it rather than proposing their own. That is the randomized timeout in action.
        </p>
        <p>
          In the rare case where two servers time out at nearly the same instant and both become candidates, neither might get a majority. The term ends with no winner. New randomized timeouts are set, and the process repeats. This is called a split vote. It is rare in practice because the timeout ranges are designed to make collisions unlikely.
        </p>

        <h2>Log Replication</h2>
        <p>
          The leader is the only server that accepts client requests. When a client sends a write, the leader appends it to its own log and immediately sends the entry to all followers via AppendEntries RPCs. Each entry carries the command and the term number when it was received.
        </p>
        <p>
          When a majority of followers acknowledge they have stored the entry, the leader considers it committed. It applies the entry to its state machine and responds to the client. Followers apply committed entries to their own state machines on the next heartbeat.
        </p>
        <p>
          The majority requirement is the core of the durability guarantee. A committed entry exists on more than half the servers. Any future leader must have been voted in by a majority, which means at least one voter had the committed entry. The voting rule ensures that voter would not vote for a candidate without that entry. So committed data is never lost, even if the leader crashes right after committing.
        </p>

        <h2>How the Leader Fixes Inconsistent Logs</h2>
        <p>
          Logs can get out of sync. A follower might have missed entries because it was down. Or it might have entries from a previous leader that was replaced before those entries were committed. The logs diverge.
        </p>
        <p>
          Here is how the leader detects and fixes it. Every AppendEntries RPC includes the index and term of the log entry immediately before the new ones. The follower checks: do I have an entry at that index with that term? If yes, the logs match up to that point, and the new entries are appended. If no, the follower rejects the RPC.
        </p>
        <p>
          When a rejection happens, the leader knows the follower&apos;s log diverges somewhere before that point. So it backs up one entry and tries again. It keeps backing up, one index at a time, until it finds a point where the follower&apos;s log matches. Once it finds the match, it sends everything after that point. The follower deletes any conflicting entries it had and replaces them with the leader&apos;s log.
        </p>
        <p>
          The leader&apos;s log always wins. Followers never push data upstream. Consistency flows in one direction: leader to followers.
        </p>

        <h2>What Happens When Three Servers Fail</h2>
        <p>
          It depends on how many you started with.
        </p>
        <p>
          Raft needs a majority of servers to be alive for anything to happen. The math: you need <code>(n/2) + 1</code> servers. In a 5-node cluster, the majority is 3. So you can lose 2 servers and the cluster keeps working. Lose 3, and you are below majority. In a 7-node cluster, the majority is 4. You can lose 3 and still have 4 alive. The cluster continues.
        </p>
        <p>
          When you lose majority, the cluster stops. No new leader can be elected because no candidate can get enough votes. No new writes can be committed because the leader cannot get acknowledgments from a majority. The system freezes.
        </p>
        <p>
          But here is the thing: existing data is safe. The servers that are still alive retain their logs. Nothing is deleted, nothing is corrupted. The cluster is just paused. When enough servers come back online and the majority is restored, a new election happens, a leader is elected, and the system picks up exactly where it left off.
        </p>
        <p>
          This is the fundamental tradeoff Raft makes. It will never let you write data that could be lost or create conflicting states. If the cost of that guarantee is temporarily refusing to accept writes, Raft pays it without hesitation.
        </p>

        <p>
          If you want to go deep, read the original paper: <a href="https://raft.github.io/raft.pdf" target="_blank" rel="noopener noreferrer">In Search of an Understandable Consensus Algorithm</a>. This is just the simplified version.
        </p>

      </BlogArticleLayout>
    </>
  );
}
