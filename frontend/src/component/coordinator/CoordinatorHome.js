"use client"

import { useState } from "react"
import { Download, Eye, Users, MessageSquare, Send, Calendar, Search, X } from "lucide-react"

// Mock data for inquiries
const mockInquiries = [
  {
    id: 1,
    title: "Product Information Request",
    customerName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1234567890",
    category: "Product",
    priority: "High",
    status: "Pending",
    isForwarded: false,
    forwardedTo: null,
    createdAt: "2024-01-15",
    description: "I need detailed information about your premium product line and pricing options.",
  },
  {
    id: 2,
    title: "Technical Support Issue",
    customerName: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1234567891",
    category: "Technical",
    priority: "Medium",
    status: "In Progress",
    isForwarded: true,
    forwardedTo: "Tech Team",
    createdAt: "2024-01-14",
    description: "Experiencing issues with the software installation process. Need immediate assistance.",
  },
  {
    id: 3,
    title: "Billing Inquiry",
    customerName: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1234567892",
    category: "Billing",
    priority: "Low",
    status: "Resolved",
    isForwarded: true,
    forwardedTo: "Finance Team",
    createdAt: "2024-01-13",
    description: "Questions regarding the recent invoice and payment methods available.",
  },
  {
    id: 4,
    title: "Partnership Proposal",
    customerName: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1234567893",
    category: "Business",
    priority: "High",
    status: "Pending",
    isForwarded: false,
    forwardedTo: null,
    createdAt: "2024-01-12",
    description: "Interested in discussing potential partnership opportunities and collaboration.",
  },
  {
    id: 5,
    title: "Service Complaint",
    customerName: "Robert Brown",
    email: "robert.brown@email.com",
    phone: "+1234567894",
    category: "Complaint",
    priority: "High",
    status: "In Progress",
    isForwarded: true,
    forwardedTo: "Customer Service",
    createdAt: "2024-01-11",
    description: "Unsatisfied with the recent service experience and seeking resolution.",
  },
]

const CoordinatorHome = () => {
  const [inquiries, setInquiries] = useState(mockInquiries)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate statistics
  const totalInquiries = inquiries.length
  const forwardedInquiries = inquiries.filter((inquiry) => inquiry.isForwarded).length
  const pendingInquiries = inquiries.filter((inquiry) => inquiry.status === "Pending").length
  const resolvedInquiries = inquiries.filter((inquiry) => inquiry.status === "Resolved").length

  // Filter inquiries based on search and filters
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === "all" || inquiry.category.toLowerCase() === filterCategory.toLowerCase()
    const matchesStatus = filterStatus === "all" || inquiry.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleForwardInquiry = (inquiryId, department) => {
    setInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.id === inquiryId
          ? { ...inquiry, isForwarded: true, forwardedTo: department, status: "In Progress" }
          : inquiry,
      ),
    )
    // Update selected inquiry if it's the one being forwarded
    if (selectedInquiry && selectedInquiry.id === inquiryId) {
      setSelectedInquiry((prev) => ({
        ...prev,
        isForwarded: true,
        forwardedTo: department,
        status: "In Progress",
      }))
    }
  }

  const generateReport = () => {
    const reportData = {
      totalInquiries,
      forwardedInquiries,
      pendingInquiries,
      resolvedInquiries,
      categories: inquiries.reduce((acc, inquiry) => {
        acc[inquiry.category] = (acc[inquiry.category] || 0) + 1
        return acc
      }, {}),
      generatedAt: new Date().toISOString(),
    }

    // Create and download report
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `inquiry-report-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedInquiry(null)
  }

  const getPriorityStyle = (priority) => {
    const baseStyle = {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "500",
      display: "inline-block",
    }

    switch (priority.toLowerCase()) {
      case "high":
        return { ...baseStyle, backgroundColor: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }
      case "medium":
        return { ...baseStyle, backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }
      case "low":
        return { ...baseStyle, backgroundColor: "#f1f5f9", color: "#64748b", border: "1px solid #cbd5e1" }
      default:
        return { ...baseStyle, backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }
    }
  }

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "500",
      display: "inline-block",
    }

    switch (status.toLowerCase()) {
      case "resolved":
        return { ...baseStyle, backgroundColor: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }
      case "in progress":
        return { ...baseStyle, backgroundColor: "#fef3c7", color: "#d97706", border: "1px solid #fed7aa" }
      case "pending":
        return { ...baseStyle, backgroundColor: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }
      default:
        return { ...baseStyle, backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }
    }
  }

  // Styles
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  }

  const maxWidthContainerStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  }

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  }

  const titleStyle = {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#111827",
    margin: 0,
  }

  const subtitleStyle = {
    color: "#6b7280",
    marginTop: "4px",
    margin: 0,
    fontSize: "16px",
  }

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  }

  const buttonHoverStyle = {
    backgroundColor: "#2563eb",
  }

  const cardStyle = {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  }

  const cardHeaderStyle = {
    padding: "20px 24px 8px 24px",
    borderBottom: "1px solid #f3f4f6",
  }

  const cardContentStyle = {
    padding: "16px 24px 24px 24px",
  }

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
  }

  const statCardHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  }

  const statTitleStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    margin: 0,
  }

  const statValueStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
    margin: "0 0 4px 0",
  }

  const statDescriptionStyle = {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  }

  const filtersContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
  }

  const filtersRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "end",
  }

  const searchContainerStyle = {
    flex: 1,
    minWidth: "300px",
  }

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "4px",
  }

  const searchInputContainerStyle = {
    position: "relative",
  }

  const searchInputStyle = {
    width: "100%",
    padding: "8px 12px 8px 40px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  }

  const searchIconStyle = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    height: "16px",
    width: "16px",
    color: "#6b7280",
  }

  const selectStyle = {
    width: "180px",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "white",
    outline: "none",
    cursor: "pointer",
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  }

  const tableHeaderStyle = {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  }

  const thStyle = {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "500",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  }

  const tdStyle = {
    padding: "12px 16px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
    color: "#374151",
  }

  const actionButtonStyle = {
    padding: "6px 12px",
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "background-color 0.2s",
  }

  const badgeStyle = {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
  }

  const forwardedBadgeStyle = {
    ...badgeStyle,
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  }

  const notForwardedBadgeStyle = {
    ...badgeStyle,
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "1px solid #cbd5e1",
  }

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  }

  const modalContentStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    maxWidth: "800px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  }

  const modalHeaderStyle = {
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }

  const modalTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  }

  const modalDescriptionStyle = {
    fontSize: "14px",
    color: "#6b7280",
    margin: "4px 0 0 0",
  }

  const closeButtonStyle = {
    padding: "8px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    transition: "background-color 0.2s",
  }

  const modalBodyStyle = {
    padding: "24px",
  }

  const modalGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  }

  const modalFieldStyle = {
    marginBottom: "12px",
  }

  const modalLabelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    display: "block",
    marginBottom: "4px",
  }

  const modalValueStyle = {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  }

  const descriptionSectionStyle = {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  }

  const forwardingSectionStyle = {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "#f0f9ff",
    borderRadius: "6px",
    border: "1px solid #e0f2fe",
  }

  const forwardingActionsStyle = {
    marginTop: "12px",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  }

  const noResultsStyle = {
    textAlign: "center",
    padding: "40px 20px",
    color: "#6b7280",
    fontSize: "16px",
  }

  return (
    <div style={containerStyle}>
      <div style={maxWidthContainerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Coordinator Dashboard</h1>
            <p style={subtitleStyle}>Manage and track all customer inquiries</p>
          </div>
          <button
            style={buttonStyle}
            onClick={generateReport}
            onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            <Download style={{ height: "16px", width: "16px" }} />
            Generate Report
          </button>
        </div>

        {/* Statistics Cards */}
        <div style={statsGridStyle}>
          <div style={cardStyle}>
            <div style={cardContentStyle}>
              <div style={statCardHeaderStyle}>
                <h3 style={statTitleStyle}>Total Inquiries</h3>
                <MessageSquare style={{ height: "16px", width: "16px", color: "#6b7280" }} />
              </div>
              <p style={statValueStyle}>{totalInquiries}</p>
              <p style={statDescriptionStyle}>All time inquiries</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={cardContentStyle}>
              <div style={statCardHeaderStyle}>
                <h3 style={statTitleStyle}>Forwarded</h3>
                <Send style={{ height: "16px", width: "16px", color: "#6b7280" }} />
              </div>
              <p style={statValueStyle}>{forwardedInquiries}</p>
              <p style={statDescriptionStyle}>{((forwardedInquiries / totalInquiries) * 100).toFixed(1)}% of total</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={cardContentStyle}>
              <div style={statCardHeaderStyle}>
                <h3 style={statTitleStyle}>Pending</h3>
                <Calendar style={{ height: "16px", width: "16px", color: "#6b7280" }} />
              </div>
              <p style={statValueStyle}>{pendingInquiries}</p>
              <p style={statDescriptionStyle}>Awaiting action</p>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={cardContentStyle}>
              <div style={statCardHeaderStyle}>
                <h3 style={statTitleStyle}>Resolved</h3>
                <Users style={{ height: "16px", width: "16px", color: "#6b7280" }} />
              </div>
              <p style={statValueStyle}>{resolvedInquiries}</p>
              <p style={statDescriptionStyle}>Successfully closed</p>
            </div>
          </div>
        </div>

        {/* Inquiry Management */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>Inquiry Management</h2>
            <p style={modalDescriptionStyle}>Search, filter, and manage all customer inquiries</p>
          </div>
          <div style={cardContentStyle}>
            {/* Filters and Search */}
            <div style={filtersContainerStyle}>
              <div style={filtersRowStyle}>
                <div style={searchContainerStyle}>
                  <label style={labelStyle} htmlFor="search">
                    Search Inquiries
                  </label>
                  <div style={searchInputContainerStyle}>
                    <Search style={searchIconStyle} />
                    <input
                      id="search"
                      type="text"
                      placeholder="Search by title, customer name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={searchInputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                      onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="category-filter">
                    Category
                  </label>
                  <select
                    id="category-filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="all">All Categories</option>
                    <option value="product">Product</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="business">Business</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="status-filter">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inquiries Table */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
              <table style={tableStyle}>
                <thead style={tableHeaderStyle}>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Priority</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Forwarded</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} style={{ transition: "background-color 0.2s" }}>
                      <td style={{ ...tdStyle, fontWeight: "500" }}>#{inquiry.id}</td>
                      <td
                        style={{
                          ...tdStyle,
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {inquiry.title}
                      </td>
                      <td style={tdStyle}>{inquiry.customerName}</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle}>{inquiry.category}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={getPriorityStyle(inquiry.priority)}>{inquiry.priority}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={getStatusStyle(inquiry.status)}>{inquiry.status}</span>
                      </td>
                      <td style={tdStyle}>
                        {inquiry.isForwarded ? (
                          <span style={forwardedBadgeStyle}>{inquiry.forwardedTo}</span>
                        ) : (
                          <span style={notForwardedBadgeStyle}>Not Forwarded</span>
                        )}
                      </td>
                      <td style={tdStyle}>{inquiry.createdAt}</td>
                      <td style={tdStyle}>
                        <button
                          style={actionButtonStyle}
                          onClick={() => openModal(inquiry)}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                        >
                          <Eye style={{ height: "16px", width: "16px" }} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInquiries.length === 0 && (
              <div style={noResultsStyle}>
                <p>No inquiries found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedInquiry && (
          <div style={modalOverlayStyle} onClick={closeModal}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <div style={modalHeaderStyle}>
                <div>
                  <h2 style={modalTitleStyle}>Inquiry Details - #{selectedInquiry.id}</h2>
                  <p style={modalDescriptionStyle}>View and manage inquiry information</p>
                </div>
                <button
                  style={closeButtonStyle}
                  onClick={closeModal}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  <X style={{ height: "20px", width: "20px" }} />
                </button>
              </div>
              <div style={modalBodyStyle}>
                <div style={modalGridStyle}>
                  <div style={modalFieldStyle}>
                    <label style={modalLabelStyle}>Customer Name</label>
                    <p style={modalValueStyle}>{selectedInquiry.customerName}</p>
                  </div>
                  <div style={modalFieldStyle}>
                    <label style={modalLabelStyle}>Email</label>
                    <p style={modalValueStyle}>{selectedInquiry.email}</p>
                  </div>
                  <div style={modalFieldStyle}>
                    <label style={modalLabelStyle}>Phone</label>
                    <p style={modalValueStyle}>{selectedInquiry.phone}</p>
                  </div>
                  <div style={modalFieldStyle}>
                    <label style={modalLabelStyle}>Category</label>
                    <span style={badgeStyle}>{selectedInquiry.category}</span>
                  </div>
                  <div style={modalFieldStyle}>
                    <label style={modalLabelStyle}>Priority</label>
                    <span style={getPriorityStyle(selectedInquiry.priority)}>{selectedInquiry.priority}</span>
                  </div>
                  <div style={modalFieldStyle}>
                    <label style={modalLabelStyle}>Status</label>
                    <span style={getStatusStyle(selectedInquiry.status)}>{selectedInquiry.status}</span>
                  </div>
                </div>

                <div style={descriptionSectionStyle}>
                  <label style={modalLabelStyle}>Description</label>
                  <p style={{ ...modalValueStyle, marginTop: "4px", lineHeight: "1.5" }}>
                    {selectedInquiry.description}
                  </p>
                </div>

                <div style={forwardingSectionStyle}>
                  <label style={modalLabelStyle}>Forwarding Status</label>
                  {selectedInquiry.isForwarded ? (
                    <div style={{ marginTop: "8px" }}>
                      <span style={forwardedBadgeStyle}>Forwarded to {selectedInquiry.forwardedTo}</span>
                    </div>
                  ) : (
                    <div style={{ marginTop: "8px" }}>
                      <p style={modalValueStyle}>This inquiry has not been forwarded yet.</p>
                      <div style={forwardingActionsStyle}>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleForwardInquiry(selectedInquiry.id, e.target.value)
                            }
                          }}
                          style={selectStyle}
                          defaultValue=""
                        >
                          <option value="">Forward to department</option>
                          <option value="Tech Team">Tech Team</option>
                          <option value="Sales Team">Sales Team</option>
                          <option value="Customer Service">Customer Service</option>
                          <option value="Finance Team">Finance Team</option>
                          <option value="Management">Management</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoordinatorHome
