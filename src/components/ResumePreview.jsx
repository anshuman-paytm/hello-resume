import { useRef } from "react";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";

function ResumePreview({ resumeData, sectionOrder }) {
  const resumeRef = useRef(null);

  const exportToPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12.7; // 0.5 inch margin
    const maxWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredHeight) => {
      if (yPos + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrapping - returns the final yPos
    // CSS: line-height: 1.15, so for 11pt font, line-height = 12.65pt ≈ 4.46mm
    const addText = (
      text,
      x,
      maxWidth,
      fontSize = 11,
      fontStyle = "normal",
      align = "left",
      lineSpacing = null,
    ) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", fontStyle);

      const lines = pdf.splitTextToSize(text, maxWidth);
      // Use line-height: 1.15 for proper spacing (matches CSS)
      const lineHeight = lineSpacing || fontSize * 1.15 * 0.352778; // Convert pt to mm: 1pt = 0.352778mm

      lines.forEach((line) => {
        checkPageBreak(lineHeight + 1);
        pdf.text(line, x, yPos, { align });
        yPos += lineHeight;
      });

      return yPos;
    };

    // Helper function to add a section title with underline
    // CSS: line-height: 1.15, padding-bottom: 0.15em, margin-bottom: 0.3em
    // Structure: text → padding-bottom → border → margin-bottom
    const addSectionTitle = (title) => {
      checkPageBreak(10);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      // Add text at current yPos (baseline)
      pdf.text(title, margin, yPos);
      // Move down by line-height to get past the text, then add padding-bottom
      // Use line-height (1.15) to move past the text baseline
      yPos += getLineHeight(11); // Move past the text line
      // Add padding-bottom (0.15em) - space between text and border
      yPos += emToMm(0.15, 11); // 0.58mm
      // Draw the border line at this yPos (1pt = 0.35mm width)
      pdf.setLineWidth(0.35);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      // Add margin-bottom (0.3em) plus clearance to prevent text overlap
      // In jsPDF, text baseline is at yPos, and text extends ~8pt above baseline
      // We need to position the next text's baseline far enough below the line
      // Add 0.3em margin + full line-height to ensure text doesn't overlap with line
      yPos += emToMm(0.3, 11) + getLineHeight(11); // 0.3em margin + full line height clearance
    };

    // Helper function to add spacing
    const addSpacing = (spacing) => {
      checkPageBreak(spacing);
      yPos += spacing;
    };

    // Helper to convert em to mm (assuming 11pt base font)
    const emToMm = (em, baseFontSize = 11) => {
      return em * baseFontSize * 0.352778; // 1pt = 0.352778mm
    };

    // Helper to get line height in mm
    const getLineHeight = (fontSize = 11) => {
      return fontSize * 1.15 * 0.352778; // line-height: 1.15
    };

    // Header Section
    const fullName = resumeData.personalInfo.fullName || "Your Name";
    checkPageBreak(10);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(fullName, pageWidth / 2, yPos, { align: "center" });
    // CSS: resume-name line-height: 1.2, margin-bottom: 0.2em at 22pt
    yPos += 22 * 1.2 * 0.352778 + emToMm(0.2, 22);

    // Contact Information
    const contactInfo = [
      resumeData.personalInfo.phone,
      resumeData.personalInfo.email,
      resumeData.personalInfo.location,
      resumeData.personalInfo.linkedin,
      resumeData.personalInfo.github,
      resumeData.personalInfo.website,
    ]
      .filter(Boolean)
      .join(" | ");

    if (contactInfo) {
      checkPageBreak(5);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(contactInfo, pageWidth / 2, yPos, { align: "center" });
      // CSS: contact-info has line-height: 1.4 (not 1.15)
      yPos += 10 * 1.4 * 0.352778; // 10pt font * 1.4 line-height
    }

    // CSS: resume-header margin-bottom: 0.6em at 11pt = 0.6 * 11pt = 6.6pt ≈ 2.33mm
    addSpacing(emToMm(0.6));

    // Summary Section (if exists)
    if (resumeData.summary && resumeData.summary.trim()) {
      checkPageBreak(8);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const summaryLines = pdf.splitTextToSize(
        resumeData.summary.trim(),
        maxWidth,
      );
      summaryLines.forEach((line) => {
        checkPageBreak(getLineHeight());
        pdf.text(line, margin, yPos, { align: "left" });
        yPos += getLineHeight();
      });
      // Summary is part of resume-section, so 0.7em spacing after
      addSpacing(emToMm(0.7));
    }

    // Render sections in order
    let isFirstSection = true;
    sectionOrder.forEach((sectionKey) => {
      // Education Section
      if (sectionKey === "education" && resumeData.education.length > 0) {
        // CSS: resume-section margin-bottom: 0.7em between sections
        // First section doesn't need spacing if no summary (header already has spacing)
        if (
          !isFirstSection ||
          (resumeData.summary && resumeData.summary.trim())
        ) {
          addSpacing(emToMm(0.9)); // Increased from 0.7em for better visual spacing
        }
        isFirstSection = false;
        addSectionTitle("EDUCATION");

        resumeData.education.forEach((edu, idx) => {
          checkPageBreak(15);

          // School and Location - CSS: margin-bottom: 0.1em
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          const schoolText = edu.school || "";
          const locationText = edu.location || "";
          pdf.text(schoolText, margin, yPos);
          if (locationText) {
            pdf.setFont("helvetica", "normal");
            pdf.text(locationText, pageWidth - margin, yPos, {
              align: "right",
            });
          }
          yPos += getLineHeight() + emToMm(0.1);

          // Degree and Date - CSS: margin-bottom: 0.1em
          pdf.setFont("helvetica", "normal");
          let degreeText = edu.degree || "";
          if (edu.minor) {
            degreeText += `, Minor in ${edu.minor}`;
          }
          pdf.text(degreeText, margin, yPos);

          const dateText = `${edu.startDate || ""} - ${edu.endDate || "Present"}`;
          pdf.text(dateText, pageWidth - margin, yPos, { align: "right" });
          yPos += getLineHeight() + emToMm(0.1);

          // GPA
          if (edu.gpa) {
            pdf.text(`GPA: ${edu.gpa}`, margin, yPos);
            yPos += getLineHeight();
          }

          // CSS: education-item margin-bottom: 0.7em between items
          if (idx < resumeData.education.length - 1) {
            addSpacing(emToMm(0.7));
          }
        });
      }

      // Experience Section
      if (sectionKey === "experience" && resumeData.experience.length > 0) {
        if (
          !isFirstSection ||
          (resumeData.summary && resumeData.summary.trim())
        ) {
          addSpacing(emToMm(0.9)); // Increased from 0.7em for better visual spacing
        }
        isFirstSection = false;
        addSectionTitle("EXPERIENCE");

        resumeData.experience.forEach((exp, idx) => {
          checkPageBreak(15);

          // Title and Date - CSS: margin-bottom: 0.1em
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.text(exp.title || "", margin, yPos);
          const dateText = `${exp.startDate || ""} - ${exp.endDate || "Present"}`;
          pdf.setFont("helvetica", "normal");
          pdf.text(dateText, pageWidth - margin, yPos, { align: "right" });
          yPos += getLineHeight() + emToMm(0.1);

          // Company and Location - CSS: margin-bottom: 0.2em
          pdf.setFont("helvetica", "normal");
          pdf.text(exp.company || "", margin, yPos);
          if (exp.location) {
            pdf.text(exp.location, pageWidth - margin, yPos, {
              align: "right",
            });
          }
          yPos += getLineHeight() + emToMm(0.2);

          // Description - CSS: margin: 0.15em 0 0 0, padding-left: 1.5em, li margin-bottom: 0.05em
          if (exp.description) {
            const descriptionLines = exp.description
              .split("\n")
              .filter((line) => line.trim());
            descriptionLines.forEach((line, lineIdx) => {
              const cleanLine = line.trim().replace(/^[-•]\s*/, "");
              checkPageBreak(getLineHeight());
              pdf.text(`• ${cleanLine}`, margin + emToMm(1.5), yPos);
              // CSS: line-height: 1.15 for list items, margin-bottom: 0.05em
              yPos += getLineHeight() + emToMm(0.05);
            });
            // Add 0.15em after description list (CSS: margin: 0.15em 0 0 0)
            yPos += emToMm(0.15);
          }

          // CSS: experience-item margin-bottom: 0.7em between items
          if (idx < resumeData.experience.length - 1) {
            addSpacing(emToMm(0.7));
          }
        });
      }

      // Projects Section
      if (sectionKey === "projects" && resumeData.projects.length > 0) {
        if (
          !isFirstSection ||
          (resumeData.summary && resumeData.summary.trim())
        ) {
          addSpacing(emToMm(0.9)); // Increased from 0.7em for better visual spacing
        }
        isFirstSection = false;
        addSectionTitle("PROJECTS");

        resumeData.projects.forEach((project, idx) => {
          checkPageBreak(15);

          // Project Name, Technologies, and Date - CSS: margin-bottom: 0.1em
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          let projectHeader = project.name || "";
          if (project.technologies && project.technologies.length > 0) {
            projectHeader += ` | ${project.technologies.join(", ")}`;
          }
          // Handle long project headers that might wrap
          const headerLines = pdf.splitTextToSize(projectHeader, maxWidth - 40); // Reserve space for date
          headerLines.forEach((line, lineIdx) => {
            checkPageBreak(getLineHeight());
            pdf.text(line, margin, yPos);
            if (lineIdx === 0 && project.startDate) {
              const dateText = `${project.startDate} - ${project.endDate || "Present"}`;
              pdf.setFont("helvetica", "normal");
              pdf.text(dateText, pageWidth - margin, yPos, { align: "right" });
            }
            yPos += getLineHeight();
          });

          // If header wrapped, add date on next line
          if (headerLines.length > 1 && project.startDate) {
            const dateText = `${project.startDate} - ${project.endDate || "Present"}`;
            pdf.setFont("helvetica", "normal");
            pdf.text(dateText, pageWidth - margin, yPos, { align: "right" });
            yPos += getLineHeight() + emToMm(0.1);
          } else if (headerLines.length === 1) {
            yPos += emToMm(0.1);
          }

          // Description - CSS: margin: 0.15em 0 0 0, padding-left: 1.5em, li margin-bottom: 0.05em
          if (project.description) {
            pdf.setFont("helvetica", "normal");
            const descriptionLines = project.description
              .split("\n")
              .filter((line) => line.trim());
            descriptionLines.forEach((line, lineIdx) => {
              const cleanLine = line.trim().replace(/^[-•]\s*/, "");
              checkPageBreak(getLineHeight());
              pdf.text(`• ${cleanLine}`, margin + emToMm(1.5), yPos);
              // CSS: line-height: 1.15 for list items, margin-bottom: 0.05em
              yPos += getLineHeight() + emToMm(0.05);
            });
            // Add 0.15em after description list
            yPos += emToMm(0.15);
          }

          // CSS: project-item margin-bottom: 0.7em between items
          if (idx < resumeData.projects.length - 1) {
            addSpacing(emToMm(0.7));
          }
        });
      }

      // Skills Section
      if (sectionKey === "skills" && resumeData.skills.length > 0) {
        if (
          !isFirstSection ||
          (resumeData.summary && resumeData.summary.trim())
        ) {
          addSpacing(emToMm(0.9)); // Increased from 0.7em for better visual spacing
        }
        isFirstSection = false;
        addSectionTitle("TECHNICAL SKILLS");

        const skillsToDisplay =
          Array.isArray(resumeData.skills) &&
          resumeData.skills.length > 0 &&
          typeof resumeData.skills[0] === "string"
            ? [{ category: "Languages", items: resumeData.skills }]
            : resumeData.skills;

        skillsToDisplay.forEach((skillCategory, idx) => {
          checkPageBreak(6);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(11);
          const skillText = `${skillCategory.category}: ${skillCategory.items.join(", ")}`;
          addText(
            skillText,
            margin,
            maxWidth,
            11,
            "normal",
            "left",
            getLineHeight(),
          );
          // addText already updates yPos, minimal spacing between categories
          if (idx < skillsToDisplay.length - 1) {
            addSpacing(emToMm(0.1));
          }
        });
      }

      // Certifications Section
      if (
        sectionKey === "certifications" &&
        resumeData.certifications.length > 0
      ) {
        if (
          !isFirstSection ||
          (resumeData.summary && resumeData.summary.trim())
        ) {
          addSpacing(emToMm(0.9)); // Increased from 0.7em for better visual spacing
        }
        isFirstSection = false;
        addSectionTitle("CERTIFICATIONS");

        resumeData.certifications.forEach((cert, idx) => {
          checkPageBreak(10);

          // Certification Name and Date
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.text(cert.name || "", margin, yPos);
          if (cert.date) {
            pdf.setFont("helvetica", "normal");
            pdf.text(cert.date, pageWidth - margin, yPos, { align: "right" });
          }
          yPos += getLineHeight();

          // Issuer
          if (cert.issuer) {
            pdf.setFont("helvetica", "normal");
            pdf.text(cert.issuer, margin, yPos);
            yPos += getLineHeight();
          }

          // CSS: certification-item margin-bottom: 0.7em between items
          if (idx < resumeData.certifications.length - 1) {
            addSpacing(emToMm(0.7));
          }
        });
      }
    });

    // Save the PDF
    pdf.save(`${resumeData.personalInfo.fullName || "resume"}-resume.pdf`);
  };

  return (
    <div className="resume-preview-container">
      <div className="preview-header">
        <h2>Resume Preview</h2>
        <button onClick={exportToPDF} className="export-btn">
          <FiDownload /> Export PDF
        </button>
      </div>
      <div className="resume-preview" ref={resumeRef}>
        <div className="resume-content">
          {/* Header Section */}
          <div className="resume-header">
            <h1 className="resume-name">
              {resumeData.personalInfo.fullName || "Your Name"}
            </h1>
            <div className="contact-info">
              {[
                resumeData.personalInfo.phone,
                resumeData.personalInfo.email,
                resumeData.personalInfo.location,
                resumeData.personalInfo.linkedin,
                resumeData.personalInfo.github,
                resumeData.personalInfo.website,
              ]
                .filter(Boolean)
                .map((info, idx, arr) => (
                  <span key={idx}>
                    {info}
                    {idx < arr.length - 1 && (
                      <span className="contact-separator"> | </span>
                    )}
                  </span>
                ))}
            </div>
          </div>

          {/* Summary Section */}
          {resumeData.summary && resumeData.summary.trim() && (
            <div className="resume-section">
              <div
                className="summary-content"
                style={{ whiteSpace: "pre-line", marginBottom: "0.7em" }}
              >
                {resumeData.summary.trim()}
              </div>
            </div>
          )}

          {/* Single Column Layout */}
          <div className="resume-body">
            {sectionOrder.map((sectionKey) => {
              // Education Section
              if (
                sectionKey === "education" &&
                resumeData.education.length > 0
              ) {
                return (
                  <div key="education" className="resume-section">
                    <h2 className="section-title">Education</h2>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="education-item">
                        <div className="education-header">
                          <span className="item-school">{edu.school}</span>
                          {edu.location && (
                            <span className="item-location">
                              {edu.location}
                            </span>
                          )}
                        </div>
                        <div className="education-details">
                          <span>
                            <span className="item-degree">{edu.degree}</span>
                            {edu.minor && (
                              <span className="item-minor">
                                , Minor in {edu.minor}
                              </span>
                            )}
                          </span>
                          <span className="item-date">
                            {edu.startDate} - {edu.endDate || "Present"}
                          </span>
                        </div>
                        {edu.gpa && (
                          <div className="item-gpa">GPA: {edu.gpa}</div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              // Experience Section
              if (
                sectionKey === "experience" &&
                resumeData.experience.length > 0
              ) {
                return (
                  <div key="experience" className="resume-section">
                    <h2 className="section-title">Experience</h2>
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="experience-item">
                        <div className="experience-header">
                          <span className="item-title">{exp.title}</span>
                          <span className="item-date">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </span>
                        </div>
                        <div className="item-company-location">
                          <span className="item-company">{exp.company}</span>
                          {exp.location && (
                            <span className="item-location">
                              {exp.location}
                            </span>
                          )}
                        </div>
                        {exp.description && (
                          <ul className="item-description-list">
                            {exp.description
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, lineIdx) => (
                                <li key={lineIdx}>
                                  {line.trim().replace(/^[-•]\s*/, "")}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              // Projects Section
              if (sectionKey === "projects" && resumeData.projects.length > 0) {
                return (
                  <div key="projects" className="resume-section">
                    <h2 className="section-title">Projects</h2>
                    {resumeData.projects.map((project, idx) => (
                      <div key={idx} className="project-item">
                        <div className="project-header">
                          <span>
                            <span className="item-title">{project.name}</span>
                            {project.technologies &&
                              project.technologies.length > 0 && (
                                <span className="project-tech-inline">
                                  {" "}
                                  | {project.technologies.join(", ")}
                                </span>
                              )}
                          </span>
                          {project.startDate && (
                            <span className="item-date">
                              {project.startDate} -{" "}
                              {project.endDate || "Present"}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <ul className="item-description-list">
                            {project.description
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, lineIdx) => (
                                <li key={lineIdx}>
                                  {line.trim().replace(/^[-•]\s*/, "")}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              // Technical Skills Section
              if (sectionKey === "skills" && resumeData.skills.length > 0) {
                // Handle both old format (array of strings) and new format (array of objects)
                const skillsToDisplay =
                  Array.isArray(resumeData.skills) &&
                  resumeData.skills.length > 0 &&
                  typeof resumeData.skills[0] === "string"
                    ? [{ category: "Languages", items: resumeData.skills }]
                    : resumeData.skills;

                return (
                  <div key="skills" className="resume-section">
                    <h2 className="section-title">Technical Skills</h2>
                    {skillsToDisplay.map((skillCategory, idx) => (
                      <div key={idx} className="skills-category">
                        <span className="skills-label">
                          {skillCategory.category}:
                        </span>{" "}
                        {skillCategory.items.join(", ")}
                      </div>
                    ))}
                  </div>
                );
              }

              // Certifications Section
              if (
                sectionKey === "certifications" &&
                resumeData.certifications.length > 0
              ) {
                return (
                  <div key="certifications" className="resume-section">
                    <h2 className="section-title">Certifications</h2>
                    {resumeData.certifications.map((cert, idx) => (
                      <div key={idx} className="certification-item">
                        <div className="certification-header">
                          <span className="item-title">{cert.name}</span>
                          {cert.date && (
                            <span className="item-date">{cert.date}</span>
                          )}
                        </div>
                        {cert.issuer && (
                          <div className="item-company">{cert.issuer}</div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;
