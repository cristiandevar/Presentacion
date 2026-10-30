"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
} from "react";
import { filters, projects, type CategoryId } from "@/lib/projects";
import styles from "./Projects.module.css";

const ROTATION_INTERVAL = 6000;

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function ProjectSlide({
  project,
  index,
  count,
  clone = false,
}: {
  project: (typeof projects)[number];
  index: number;
  count: number;
  clone?: boolean;
}) {
  const content = (
    <>
      <div className={styles.projectDetails}>
        <div className={styles.projectHeading}>
          <span className={styles.projectMark} aria-hidden="true">
            {project.initials}
          </span>
          <span className={styles.projectNumber}>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <p className={styles.projectCopy}>{project.description}</p>
        </div>
        <div className={styles.projectFooter}>
          <div className={styles.projectTags}>
            {project.tags.map((tag) => (
              <span className={styles.tag} key={tag}>
                {tag}
              </span>
            ))}
          </div>
          {project.repo ? (
            clone ? (
              <span className={styles.repoLink}>Ver repositorio</span>
            ) : (
              <a
                className={styles.repoLink}
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver repositorio
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
                <span className="visually-hidden">(se abre en una nueva pestaña)</span>
              </a>
            )
          ) : (
            <span className={styles.repoUnavailable}>Repositorio privado</span>
          )}
        </div>
      </div>
      <div className={styles.projectArtwork} aria-hidden="true">
        <span>{project.initials}</span>
      </div>
    </>
  );

  if (clone) {
    return (
      <div className={styles.project} aria-hidden="true" inert>
        {content}
      </div>
    );
  }

  return (
    <article
      className={styles.project}
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${index + 1} de ${count}: ${project.title}`}
    >
      {content}
    </article>
  );
}

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");
  const [visualSlide, setVisualSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rotationButtonRef = useRef<HTMLButtonElement>(null);
  const rotationPointerDownRef = useRef(false);
  const visualSlideRef = useRef(visualSlide);
  const scrollFrameRef = useRef<number | null>(null);

  const visibleProjects = useMemo(() => {
    const term = normalize(deferredQuery.trim());

    return projects.filter((project) => {
      const matchesFilter =
        activeFilter === "all" || project.categories.includes(activeFilter);
      const matchesSearch = term.length === 0 || normalize(project.search).includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, deferredQuery]);

  const count = visibleProjects.length;
  const activeSlide =
    count === 0
      ? 0
      : visualSlide === 0
        ? count - 1
        : visualSlide === count + 1
          ? 0
          : visualSlide - 1;

  const resetCarousel = () => {
    visualSlideRef.current = 1;
    setVisualSlide(1);
    const firstSlide = trackRef.current?.children.item(1);

    if (firstSlide instanceof HTMLElement) {
      viewportRef.current?.scrollTo({ left: firstSlide.offsetLeft, behavior: "instant" });
    }
  };

  const moveSlide = useCallback(
    (direction: -1 | 1) => {
      if (count < 2) {
        return;
      }

      const currentSlide = visualSlideRef.current;
      const nextSlide =
        direction === 1
          ? currentSlide === count
            ? count + 1
            : currentSlide + 1
          : currentSlide === 1
            ? 0
            : currentSlide - 1;

      visualSlideRef.current = nextSlide;
      setVisualSlide(nextSlide);
      const target = trackRef.current?.children.item(nextSlide);

      if (target instanceof HTMLElement) {
        viewportRef.current?.scrollTo({
          left: target.offsetLeft,
          behavior: reducedMotion ? "instant" : "smooth",
        });
      }
    },
    [count, reducedMotion],
  );

  useLayoutEffect(() => {
    const slide = trackRef.current?.children.item(1);

    if (slide instanceof HTMLElement) {
      viewportRef.current?.scrollTo({ left: slide.offsetLeft, behavior: "instant" });
    }
  }, [visibleProjects]);

  const updateActiveSlide = () => {
    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!viewport || !track) {
        return;
      }

      const slides = Array.from(track.children).filter(
        (slide): slide is HTMLElement => slide instanceof HTMLElement,
      );

      if (slides.length === 0) {
        return;
      }

      const closestSlide = slides.reduce(
        (closest, slide, index) =>
          Math.abs(slide.offsetLeft - viewport.scrollLeft) <
          Math.abs(slides[closest].offsetLeft - viewport.scrollLeft)
            ? index
            : closest,
        0,
      );

      visualSlideRef.current = closestSlide;
      setVisualSlide(closestSlide);
    });
  };

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    });
    const updatePageVisibility = () => setIsPageVisible(!document.hidden);

    observer.observe(viewport);
    document.addEventListener("visibilitychange", updatePageVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePageVisibility);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPaused || isHovered || reducedMotion || !isInView || !isPageVisible || count < 2) {
      return;
    }

    const timer = window.setInterval(() => moveSlide(1), ROTATION_INTERVAL);
    return () => window.clearInterval(timer);
  }, [count, isHovered, isInView, isPageVisible, isPaused, moveSlide, reducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const normalizeLoopPosition = () => {
      const currentSlide = visualSlideRef.current;
      const resetSlide = currentSlide === 0 ? count : currentSlide === count + 1 ? 1 : null;

      if (resetSlide === null) {
        return;
      }

      const target = trackRef.current?.children.item(resetSlide);

      if (target instanceof HTMLElement) {
        viewport.scrollTo({ left: target.offsetLeft, behavior: "instant" });
        visualSlideRef.current = resetSlide;
        setVisualSlide(resetSlide);
      }
    };

    viewport.addEventListener("scrollend", normalizeLoopPosition);
    return () => viewport.removeEventListener("scrollend", normalizeLoopPosition);
  }, [count]);

  const pauseRotation = (event: FocusEvent<HTMLElement>) => {
    if (event.target === rotationButtonRef.current && rotationPointerDownRef.current) {
      return;
    }

    setIsPaused(true);
  };
  const toggleRotation = () => {
    rotationPointerDownRef.current = false;
    setIsPaused((paused) => !paused);
  };

  return (
    <section
      className={styles.section}
      id="proyectos"
      aria-labelledby="projects-title"
      onFocusCapture={pauseRotation}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") {
          if (event.target !== rotationButtonRef.current) {
            setIsPaused(true);
          }
          return;
        }

        setIsHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") {
          setIsHovered(false);
        }
      }}
    >
      <div className={styles.heading}>
        <h2 className={styles.title} id="projects-title">
          Proyectos
        </h2>
        <span className={styles.count} id="project-count" aria-live="polite">
          {String(count).padStart(2, "0")} {count === 1 ? "proyecto" : "proyectos"}
        </span>
        <div className={styles.carouselControls} role="group" aria-label="Controles del carrusel">
          <span
            className={styles.slidePosition}
            id="project-position"
            aria-atomic="true"
            aria-live={isPaused || reducedMotion ? "polite" : "off"}
          >
            {String(count === 0 ? 0 : activeSlide + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <button
            className={styles.carouselButton}
            type="button"
            ref={rotationButtonRef}
            onPointerDown={() => {
              rotationPointerDownRef.current = true;
            }}
            onPointerCancel={() => {
              rotationPointerDownRef.current = false;
            }}
            aria-label={
              reducedMotion
                ? "Movimiento automático desactivado por la preferencia de movimiento reducido"
                : isPaused
                  ? "Reanudar carrusel"
                  : "Pausar carrusel"
            }
            onClick={toggleRotation}
            disabled={reducedMotion || count < 2}
          >
            {isPaused || reducedMotion ? (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m9 6 10 6-10 6V6Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6v12m6-12v12" />
              </svg>
            )}
          </button>
          <button
            className={styles.carouselButton}
            type="button"
            aria-label="Proyecto anterior"
            onClick={() => moveSlide(-1)}
            disabled={count < 2}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            className={styles.carouselButton}
            type="button"
            aria-label="Proyecto siguiente"
            onClick={() => moveSlide(1)}
            disabled={count < 2}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filtrar proyectos por categoría">
          {filters.map((filter) => (
            <button
              className={styles.filter}
              key={filter.id}
              type="button"
              aria-pressed={activeFilter === filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                resetCarousel();
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <label className={styles.searchWrap} htmlFor="project-search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input
            className={styles.searchInput}
            id="project-search"
            type="search"
            aria-label="Buscar proyectos"
            placeholder="Buscar proyecto..."
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetCarousel();
            }}
          />
        </label>
      </div>

      <div
        className={styles.projectViewport}
        id="project-grid"
        role="region"
        aria-label="Carrusel de proyectos"
        aria-roledescription="carrusel"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            setIsPaused(true);
            moveSlide(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        onScroll={updateActiveSlide}
        ref={viewportRef}
      >
        <div className={styles.projectCarousel} ref={trackRef}>
          {count > 0 && (
            <ProjectSlide
              clone
              project={visibleProjects[count - 1]}
              index={count - 1}
              count={count}
            />
          )}
          {visibleProjects.map((project, index) => (
            <ProjectSlide
              key={project.slug}
              project={project}
              index={index}
              count={count}
            />
          ))}
          {count > 0 && <ProjectSlide clone project={visibleProjects[0]} index={0} count={count} />}
        </div>
      </div>

      <p className={styles.empty} id="empty-state" role="status" hidden={count !== 0}>
        No se encontraron proyectos con ese criterio. Intente con otro nombre o filtro.
      </p>
    </section>
  );
}
