import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [latestNotifications, setLatestNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`
  };

  const fetchSubmissions = async () => {
    const res = await api.get("/submissions", {
      headers: authHeaders
    });

    setSubmissions(res.data.data || []);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin";
      return;
    }

    fetchSubmissions();
  }, []);

  useEffect(() => {
    socket.on("new-submission", (newSubmission) => {
      setSubmissions((prev) => [newSubmission, ...prev]);
      setNotificationCount((prev) => prev + 1);
      setLatestNotifications((prev) => [newSubmission, ...prev].slice(0, 5));

      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {});
    });

    socket.on("online-users", (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off("new-submission");
      socket.off("online-users");
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin";
  };

  const toggleReadStatus = async (item) => {
    const newStatus = item.status === "read" ? "new" : "read";

    await api.patch(
      `/submissions/${item._id}/status`,
      { status: newStatus },
      { headers: authHeaders }
    );

    setSubmissions((prev) =>
      prev.map((submission) =>
        submission._id === item._id
          ? { ...submission, status: newStatus }
          : submission
      )
    );

    if (selectedSubmission?._id === item._id) {
      setSelectedSubmission({
        ...selectedSubmission,
        status: newStatus
      });
    }
  };

  const toggleArchiveStatus = async (item) => {
    const newStatus = item.status === "archived" ? "read" : "archived";

    await api.patch(
      `/submissions/${item._id}/status`,
      { status: newStatus },
      { headers: authHeaders }
    );

    setSubmissions((prev) =>
      prev.map((submission) =>
        submission._id === item._id
          ? { ...submission, status: newStatus }
          : submission
      )
    );

    if (selectedSubmission?._id === item._id) {
      setSelectedSubmission({
        ...selectedSubmission,
        status: newStatus
      });
    }
  };

  const deleteSubmission = async (id) => {
    const confirmDelete = window.confirm("Delete this submission?");
    if (!confirmDelete) return;

    await api.delete(`/submissions/${id}`, {
      headers: authHeaders
    });

    setSelectedSubmission(null);
    fetchSubmissions();
  };

  const openSubmission = (item) => {
    setSelectedSubmission(item);
  };

  const filteredSubmissions = submissions.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.fullName?.toLowerCase().includes(keyword) ||
      item.email?.toLowerCase().includes(keyword) ||
      item.subject?.toLowerCase().includes(keyword) ||
      item.message?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const rows = filteredSubmissions.map((item) => ({
      Name: item.fullName,
      Email: item.email,
      Phone: item.phone || "",
      Subject: item.subject,
      Status: item.status,
      Message: item.message,
      Date: new Date(item.createdAt).toLocaleString()
    }));

    const headers = Object.keys(
      rows[0] || {
        Name: "",
        Email: "",
        Phone: "",
        Subject: "",
        Status: "",
        Message: "",
        Date: ""
      }
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header]).replaceAll('"', '""')}"`)
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "smartsend-submissions.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const total = submissions.length;
  const unread = submissions.filter((item) => item.status === "new").length;
  const read = submissions.filter((item) => item.status === "read").length;
  const archived = submissions.filter(
    (item) => item.status === "archived"
  ).length;

  const submissionsByDate = Object.values(
    submissions.reduce((acc, item) => {
      const date = new Date(item.createdAt).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = {
          date,
          submissions: 0
        };
      }

      acc[date].submissions += 1;
      return acc;
    }, {})
  );

  const statusChartData = [
    { name: "New", value: unread },
    { name: "Read", value: read },
    { name: "Archived", value: archived }
  ];

  const countryChartData = Object.values(
  submissions.reduce((acc, item) => {
    const country = item.country || "Unknown";

    if (!acc[country]) {
      acc[country] = {
        name: country,
        value: 0
      };
    }

    acc[country].value += 1;
    return acc;
  }, {})
);

const chartColors = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ef4444"];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">SmartSend AI Dashboard</h1>
          <p className="text-slate-400">Manage contact submissions</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-slate-400">
              {onlineUsers} users online
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setNotificationCount(0);
              }}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold"
            >
              🔔
              {notificationCount > 0 && (
                <span className="ml-2 bg-red-600 px-2 py-0.5 rounded-full text-xs">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50">
                <div className="p-4 border-b border-slate-700 font-bold">
                  Notifications
                </div>

                {latestNotifications.length === 0 ? (
                  <p className="p-4 text-slate-400 text-sm">
                    No new notifications
                  </p>
                ) : (
                  latestNotifications.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 border-b border-slate-800"
                    >
                      <p className="font-semibold">{item.subject}</p>
                      <p className="text-slate-400 text-sm">
                        From {item.fullName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <a
            href="/settings"
            className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg font-semibold"
          >
            Settings
          </a>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Total Submissions</p>
          <h2 className="text-3xl font-bold">{total}</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">New Messages</p>
          <h2 className="text-3xl font-bold">{unread}</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Read Messages</p>
          <h2 className="text-3xl font-bold">{read}</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400">Archived</p>
          <h2 className="text-3xl font-bold">{archived}</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
    <h2 className="text-xl font-bold mb-4">Submission Trend</h2>

    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={submissionsByDate}>
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              background: "#020617",
              border: "1px solid #1e293b",
              borderRadius: "12px"
            }}
          />
          <Line
            type="monotone"
            dataKey="submissions"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
    <h2 className="text-xl font-bold mb-4">Status Overview</h2>

    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={statusChartData}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              background: "#020617",
              border: "1px solid #1e293b",
              borderRadius: "12px"
            }}
          />
          <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
    <h2 className="text-xl font-bold mb-4">Top Countries</h2>

    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={countryChartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {countryChartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#020617",
              border: "1px solid #1e293b",
              borderRadius: "12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Recent Submissions</h2>
            <p className="text-slate-400 text-sm">
              Showing {filteredSubmissions.length} of {total}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>

            <button
              onClick={exportCSV}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Files</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubmissions.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-slate-800 hover:bg-slate-800/50"
                >
                  <td className="p-4 font-semibold">{item.fullName}</td>
                  <td className="p-4 text-slate-300">{item.email}</td>
                  <td className="p-4">{item.subject}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === "new"
                          ? "bg-blue-600"
                          : item.status === "read"
                          ? "bg-green-600"
                          : "bg-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
  {new Date(item.createdAt).toLocaleString()}
</td>

<td className="p-4 text-slate-300">
  {item.files?.length > 0 ? `${item.files.length} file(s)` : "No files"}
</td>

<td className="p-4">
  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openSubmission(item)}
                      className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
                    >
                      View
                    </button>

                    <button
                      onClick={() => toggleReadStatus(item)}
                      className={`px-3 py-1 rounded text-sm ${
                        item.status === "read"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {item.status === "read" ? "Mark New" : "Mark Read"}
                    </button>

                    <button
                      onClick={() => toggleArchiveStatus(item)}
                      className={`px-3 py-1 rounded text-sm ${
                        item.status === "archived"
                          ? "bg-cyan-600 hover:bg-cyan-700"
                          : "bg-slate-600 hover:bg-slate-700"
                      }`}
                    >
                      {item.status === "archived" ? "Restore" : "Archive"}
                    </button>

                    <button
                      onClick={() => deleteSubmission(item._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                      </div>
                     </td>
                  
                </tr>
              ))}

              {filteredSubmissions.length === 0 && (
                <tr>
                  <div className="py-8">
  <div className="text-4xl mb-2 animate-bounce">📭</div>
  <p>No submissions found.</p>
  <p className="text-sm text-slate-500 mt-1">
    New contact messages will appear here.
  </p>
</div>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedSubmission.subject}
                </h2>
                <p className="text-slate-400">
                  From {selectedSubmission.fullName}
                </p>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-slate-200">
              <p>
                <b>Email:</b> {selectedSubmission.email}
              </p>
              <p>
                <b>Phone:</b> {selectedSubmission.phone || "Not provided"}
              </p>
              <p>
  <b>IP Address:</b> {selectedSubmission.ipAddress || "Unknown"}
</p>

<p>
  <b>Location:</b> {selectedSubmission.city || "Unknown"},{" "}
  {selectedSubmission.country || "Unknown"}
</p>
              <p>
                <b>Status:</b> {selectedSubmission.status}
              </p>
              <p>
                <b>Date:</b>{" "}
                {new Date(selectedSubmission.createdAt).toLocaleString()}
              </p>

              <div className="bg-slate-800 rounded-xl p-4 mt-4">
                <p className="text-slate-400 mb-2">Message</p>
                <p className="leading-7">{selectedSubmission.message}</p>
              </div>

              {selectedSubmission.files?.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-4">
  <p className="text-slate-400 mb-2">Attachments</p>

  {selectedSubmission.files?.length > 0 ? (
    <div className="space-y-3">
      {selectedSubmission.files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-slate-900 rounded-lg p-3"
        >
          <div>
            <p className="font-semibold">{file.originalName}</p>
            <p className="text-slate-400 text-sm">
              {file.mimeType || "Unknown type"} •{" "}
              {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Unknown size"}
            </p>
          </div>

          <a
            href={`http://localhost:5000/${file.filePath}`}
            target="_blank"
            rel="noreferrer"
            download
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-slate-400 text-sm">No attachments uploaded.</p>
  )}
</div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => deleteSubmission(selectedSubmission._id)}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
              >
                Delete
              </button>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;