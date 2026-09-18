import React, { useState, useEffect } from 'react';
import { Activity, Search, Filter, Trash2, RefreshCw, Clock, Globe, Shield } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const AdminLogs = () => {
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Filters
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [availableActions, setAvailableActions] = useState([]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminLogs({
        user: userFilter,
        action: actionFilter,
        method: methodFilter,
        statusCode: statusFilter,
        startDate,
        endDate,
      });

      if (res.success) {
        setLogs(res.logs || []);
        setTotal(res.total || 0);
        if (res.availableActions) {
          setAvailableActions(res.availableActions);
        }
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, methodFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleClearLogsClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClear = async () => {
    setClearing(true);
    try {
      const res = await api.clearAdminLogs();
      if (res.success) {
        toast.success('Audit logs history has been cleared.', 'Logs Purged');
        setConfirmOpen(false);
        fetchLogs();
      }
    } catch (e) {
      toast.error(e.message || 'Failed to clear activity logs.', 'Error');
    } finally {
      setClearing(false);
    }
  };

  const getMethodBadgeClass = (method) => {
    switch (method) {
      case 'POST':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'PUT':
        return { bg: '#FEF3C7', text: '#B45309' };
      case 'DELETE':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'GET':
      default:
        return { bg: '#E0F2FE', text: '#0284C7' };
    }
  };

  const getStatusBadge = (code) => {
    let color = '#10B981';
    if (code >= 400 && code < 500) color = '#F59E0B';
    if (code >= 500) color = '#EF4444';

    return (
      <span
        style={{
          fontSize: '12px',
          fontWeight: 700,
          color,
          backgroundColor: `${color}18`,
          padding: '2px 8px',
          borderRadius: '6px',
        }}
      >
        {code}
      </span>
    );
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Activity Audit Logs</h1>
          <p className="greeting-sub">
            Express.js logging middleware recording system operations, response times, and IP addresses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchLogs} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleClearLogsClick} className="btn btn-danger btn-sm" title="Clear logs">
            <Trash2 size={14} /> Clear Logs
          </button>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              alignItems: 'flex-end',
            }}
          >
            {/* User Search */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '12px' }}>User Email / Role</label>
              <input
                type="text"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="e.g. student@yuvasetu.edu"
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '13px' }}
              />
            </div>

            {/* Action Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '12px' }}>Action</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '13px' }}
              >
                <option value="All">All Actions</option>
                <option value="Login">Login</option>
                <option value="User Registration">User Registration</option>
                <option value="Profile Update">Profile Update</option>
                <option value="Education Update">Education Update</option>
                <option value="Skills Update">Skills Update</option>
                <option value="Resume Upload">Resume Upload</option>
                <option value="Placement Application">Placement Application</option>
                <option value="Placement Drive Creation">Placement Drive Creation</option>
                <option value="Application Status Update">Application Status Update</option>
              </select>
            </div>

            {/* HTTP Method */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '12px' }}>HTTP Method</label>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '13px' }}
              >
                <option value="All">All Methods</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="GET">GET</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            {/* Status Code */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '12px' }}>Status Code</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '13px' }}
              >
                <option value="All">All Status Codes</option>
                <option value="200">200 OK</option>
                <option value="201">201 Created</option>
                <option value="400">400 Bad Request</option>
                <option value="401">401 Unauthorized</option>
                <option value="403">403 Forbidden</option>
                <option value="404">404 Not Found</option>
                <option value="500">500 Server Error</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '12px' }}>From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '13px' }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ padding: '10px 18px', height: '38px', borderRadius: '10px' }}
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <Activity size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3>No Activity Logs Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>
            No records matched your filtering conditions.
          </p>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Action & Endpoint</th>
                <th>User / Role</th>
                <th>Method</th>
                <th>Status</th>
                <th>IP Address</th>
                <th>Response Time</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const mb = getMethodBadgeClass(log.httpMethod);

                return (
                  <tr key={log._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {log.action}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {log.endpoint}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{log.userEmail}</div>
                      <span
                        style={{
                          fontSize: '10.5px',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          color: log.userRole === 'admin' ? '#7C3AED' : '#0284C7',
                        }}
                      >
                        {log.userRole}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          backgroundColor: mb.bg,
                          color: mb.text,
                          padding: '3px 7px',
                          borderRadius: '6px',
                        }}
                      >
                        {log.httpMethod}
                      </span>
                    </td>

                    <td>{getStatusBadge(log.statusCode)}</td>

                    <td style={{ fontSize: '12.5px', color: '#64748B' }}>
                      {log.ipAddress || '127.0.0.1'}
                    </td>

                    <td style={{ fontSize: '12.5px', color: '#64748B' }}>
                      <span style={{ fontWeight: 600 }}>{log.responseTime || 0}</span> ms
                    </td>

                    <td style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        title="Clear Activity Audit Logs?"
        message="Are you sure you want to permanently delete all server activity audit logs from the database? This action cannot be reversed."
        confirmText="Yes, Purge Logs"
        loading={clearing}
      />
    </div>
  );
};

export default AdminLogs;
